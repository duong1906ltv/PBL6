import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"],
    },
    fullName: {
        type: String,
    },
    gender: {
        type: Boolean,
    },
    dayOfBirth: {
        type: Date,
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    hoppy: {
        type: String,
    },
    friends: {
        type: Array,
        default: []
    }
});
export default mongoose.model("Profile", ProfileSchema);
