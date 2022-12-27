import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Messages from "../../../components/messenger";
import ChatBar from "../../../components/chat-bar";
import "./chat.scss";
import { io } from "socket.io-client";
import axios from "axios";
import { useAppContext } from "../../../context/appContext";

function Chat(props) {
	const [currentChat, setCurrentChat] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const ENDPOINT = "http://pbl6fb.online/";
	const socket = useRef(io(ENDPOINT));
	const {
		user,
		conversation,
		getMyConversation,
		listConversations,
		getConversationFromTwoUser,
	} = useAppContext();
	const scrollRef = useRef();
	const location = useLocation();
	const navigate = useNavigate();
	useEffect(() => {
		getMyConversation();
		socket.current = io(ENDPOINT);
		socket.current.on("getMessage", (data) => {
			setArrivalMessage({
				sender: data.senderId,
				text: data.text,
				createdAt: Date.now(),
			});
		});
		if (location.state?.friend_id) {
			getConversationFromTwoUser(user._id, location.state.friend_id);
		}
	}, []);
	useEffect(() => {
		if (conversation) {
			setCurrentChat(conversation);
		}
	}, [conversation]);
	useEffect(() => {
		arrivalMessage &&
			currentChat?.members.includes(arrivalMessage.sender) &&
			setMessages((prev) => [...prev, arrivalMessage]);
	}, [arrivalMessage, currentChat]);

	useEffect(() => {
		if (currentChat) {
			navigate("/chat", { replace: true });
			const getMessages = async () => {
				try {
					const res = await axios.get(
						"/api/message/" + currentChat?._id
					);
					setMessages(res.data);
				} catch (err) {
					console.log(err);
				}
			};
			getMessages();
			currentChat.members.map((userId) => {
				socket.current.emit("addUser", userId);
			});
		}
	}, [currentChat]);
	const handleSubmit = async () => {
		if (newMessage === "") {
			return;
		}
		const message = {
			sender: user._id,
			text: newMessage,
			conversationId: currentChat._id,
		};

		const receiverId = currentChat.members?.find(
			(member) => member !== user._id
		);
		socket.current.emit("sendMessage", {
			senderId: user._id,
			receiverId,
			text: newMessage,
		});

		try {
			const res = await axios.post("/api/message", message);
			setMessages([...messages, res.data]);
			setNewMessage("");
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="chat-container">
			<div className="chat-content col-12">
				<div className="border-right">
					<div className="search-bar col-11 m-auto my-2">
						<span
							role="img"
							aria-label="search"
							class="anticon anticon-search"
						>
							<svg
								viewBox="64 64 896 896"
								focusable="false"
								data-icon="search"
								width="1em"
								height="1em"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
							</svg>
						</span>
						<input type="text" placeholder="Tìm kiếm" />
					</div>
					<div className="chat-bar">
						{listConversations.map((c) => (
							<div onClick={() => setCurrentChat(c)}>
								{" "}
								<ChatBar
									conversation={c}
									currentUser={user}
								/>{" "}
							</div>
						))}
					</div>
				</div>
				<div className="d-flex flex-column position-relative">
					{currentChat ? (
						<Messages
							listmessages={messages}
							friendId={currentChat.members?.find(
								(x) => x !== user._id
							)}
							handleSubmit={handleSubmit}
							setNewMessage={setNewMessage}
							newMessage={newMessage}
							arrivalMessage={arrivalMessage}
						/>
					) : (
						<div className="text-center m-auto">
							<h4>Your Messages</h4>
							<p>Hãy gửi tin nhắn và ảnh cho bạn bè hoặc nhóm</p>
							<button>Gửi tin nhắn</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Chat;
