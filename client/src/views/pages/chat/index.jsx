import React, { useState } from "react";
// import { IoIosArrowDown } from "react-icons/io";
// import { FiEdit } from "react-icons/fi";
// import { RiMessengerLine } from "react-icons/ri";
import Messages from "../../../components/messenger";

import "./chat.scss";

function Chat() {
  const [showMessange, setShowMessange] = useState(false);

  return (
    <div className="chat-container">
      <div className="chat-content">
        <div className="chat-content-left">
          <div className="chat-content-left__header">
            <div className="chat-content-left__header__user-name">
              <span className="span">h_hiuu</span>
            </div>
          </div>
          <div className="chat-content-left__content">
            <div
              className="chat-content-left__content__small-messenger"
              onClick={() => setShowMessange(true)}
            >
              <div className="avatar">
                <img
                  alt=""
                  src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/280374790_1477115089370427_2274356777150785265_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=BGiT7grLdloAX9IRJ_q&_nc_ht=scontent.fdad1-2.fna&oh=00_AT9cSGOCa9XgxlLhOaqjXNYXm19qGb65c2eSuzlvgQuLGQ&oe=63279F08"
                />
              </div>
              <div className="name">
                <div>Hồ Hiếu</div>
                <div>Okelala</div>
              </div>
            </div>
            <div
              className="chat-content-left__content__small-messenger"
              onClick={() => setShowMessange(true)}
            >
              <div className="avatar">
                <img
                  alt=""
                  src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-1/295441581_3326414374248805_3619395398620134247_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=8LorMmRFan0AX87AZCo&_nc_ht=scontent.fdad1-3.fna&oh=00_AT_GW8dD7XhXWVMa3VrED16YOzEosnrQfX3Dpwdfp-R0rA&oe=632749FC"
                />
              </div>
              <div className="name">
                <div>Chinh</div>
                <div>Okelala</div>
              </div>
            </div>
            <div
              className="chat-content-left__content__small-messenger"
              onClick={() => setShowMessange(true)}
            >
              <div className="avatar">
                <img
                  alt=""
                  src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/280374790_1477115089370427_2274356777150785265_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=BGiT7grLdloAX9IRJ_q&_nc_ht=scontent.fdad1-2.fna&oh=00_AT9cSGOCa9XgxlLhOaqjXNYXm19qGb65c2eSuzlvgQuLGQ&oe=63279F08"
                />
              </div>
              <div className="name">
                <div>Hồ Hiếu</div>
                <div>Okelala</div>
              </div>
            </div>
            <div
              className="chat-content-left__content__small-messenger"
              onClick={() => setShowMessange(true)}
            >
              <div className="avatar">
                <img
                  alt=""
                  src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-1/295441581_3326414374248805_3619395398620134247_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=8LorMmRFan0AX87AZCo&_nc_ht=scontent.fdad1-3.fna&oh=00_AT_GW8dD7XhXWVMa3VrED16YOzEosnrQfX3Dpwdfp-R0rA&oe=632749FC"
                />
              </div>
              <div className="name">
                <div>Chinh</div>
                <div>Okelala</div>
              </div>
            </div>
            <div
              className="chat-content-left__content__small-messenger"
              onClick={() => setShowMessange(true)}
            >
              <div className="avatar">
                <img
                  alt=""
                  src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/280374790_1477115089370427_2274356777150785265_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=BGiT7grLdloAX9IRJ_q&_nc_ht=scontent.fdad1-2.fna&oh=00_AT9cSGOCa9XgxlLhOaqjXNYXm19qGb65c2eSuzlvgQuLGQ&oe=63279F08"
                />
              </div>
              <div className="name">
                <div>Hồ Hiếu</div>
                <div>Okelala</div>
              </div>
            </div>
            <div
              className="chat-content-left__content__small-messenger"
              onClick={() => setShowMessange(true)}
            >
              <div className="avatar">
                <img
                  alt=""
                  src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-1/295441581_3326414374248805_3619395398620134247_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=8LorMmRFan0AX87AZCo&_nc_ht=scontent.fdad1-3.fna&oh=00_AT_GW8dD7XhXWVMa3VrED16YOzEosnrQfX3Dpwdfp-R0rA&oe=632749FC"
                />
              </div>
              <div className="name">
                <div>Chinh</div>
                <div>Okelala</div>
              </div>
            </div>
            <div
              className="chat-content-left__content__small-messenger"
              onClick={() => setShowMessange(true)}
            >
              <div className="avatar">
                <img
                  alt=""
                  src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/280374790_1477115089370427_2274356777150785265_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=BGiT7grLdloAX9IRJ_q&_nc_ht=scontent.fdad1-2.fna&oh=00_AT9cSGOCa9XgxlLhOaqjXNYXm19qGb65c2eSuzlvgQuLGQ&oe=63279F08"
                />
              </div>
              <div className="name">
                <div>Hồ Hiếu</div>
                <div>Okelala</div>
              </div>
            </div>
            <div
              className="chat-content-left__content__small-messenger"
              onClick={() => setShowMessange(true)}
            >
              <div className="avatar">
                <img
                  alt=""
                  src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-1/295441581_3326414374248805_3619395398620134247_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=8LorMmRFan0AX87AZCo&_nc_ht=scontent.fdad1-3.fna&oh=00_AT_GW8dD7XhXWVMa3VrED16YOzEosnrQfX3Dpwdfp-R0rA&oe=632749FC"
                />
              </div>
              <div className="name">
                <div>Chinh</div>
                <div>Okelala</div>
              </div>
            </div>
          </div>
        </div>
        <div className="chat-content-right">
          <Messages state={showMessange} />
          <div className="chat-content-right__content">
            <p>Your Messages</p>
            <p>Hãy gửi tin nhắn và ảnh cho bạn bè hoặc nhóm</p>
            <button>Gửi tin nhắn</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
