const express = require("express")
const app = express();

const cors = require("cors")
app.use(cors())
const http = require("http").Server(app)

const socketIO = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let users = []

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)  
    socket.on("message", data => {
      socketIO.emit("messageResponse", data)
    })

    socket.on("typing", data => (
      socket.broadcast.emit("typingResponse", data)
    ))

    socket.on("newUser", data => {
      users.push(data)
      socketIO.emit("newUserResponse", users)
    })
 
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
      users = users.filter(user => user.socketID !== socket.id)
      socketIO.emit("newUserResponse", users)
      socket.disconnect()
    });
});


const dotenv = require("dotenv")
dotenv.config();

const connectDB = require("./db/connect.js")

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    http.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
