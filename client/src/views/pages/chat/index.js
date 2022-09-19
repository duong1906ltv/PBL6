import React from "react";
import Messages from "../../../components/messenger";
import ChatBar from "../../../components/chat-bar";
import { listChatBar } from "../../../utils";
import "./chat.scss";

function Chat() {

    return (
        <div className="chat-container">
            <div className="chat-content col-12">
                <div className="border-right">
                    <div className="border-bottom py-3 text-center">
                        <div className="m-auto">
                            <h6 className="my-0">h_hiuu</h6>
                        </div>
                    </div>
                    <div className="chat-bar">
                        {listChatBar.map((item) => (
                            <ChatBar data={item} />
                        ))}
                    </div>
                </div>
                <div className="d-flex flex-column position-relative">
                    <Messages state={true} />
                    <div className="text-center m-auto">
                        <h4>Your Messages</h4>
                        <p>Hãy gửi tin nhắn và ảnh cho bạn bè hoặc nhóm</p>
                        <button>Gửi tin nhắn</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
