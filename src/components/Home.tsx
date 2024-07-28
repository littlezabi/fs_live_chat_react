import axios from "axios";
import {
  Cookies,
  createForm,
  getRandomColor,
  life,
  numberFormat,
  randomIcon,
  setUserCharName,
  VARS_,
} from "../utils/globals";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../context";

export default () => {
  const [chatType, setChatType] = useState("chat-password-url");
  const { user, setValue }: any = useContext(Store);
  const [botAvatar] = useState(randomIcon());
  const [loading, setLoading] = useState(false);
  const [totalChats, setTotalChats] = useState(0);
  const [chats, setChats]: any = useState([]);
  const handleLogout = () => {
    Cookies.delete('live-user');
    setValue((state:any) => ({...state, user: null}))
  }
  const handleMessage = (e: any) => {
    e.preventDefault();
    const n = e.target["message"].value;
    console.log(n);
    // setMessage(e.target.value);
    sendMessage(n);
  };
  const sendMessage = async (message: string) => {
    if (!user && !user.id) {
      setValue((state: any) => ({
        ...state,
        message: {
          message: "Please login then you can chat.",
          variant: "alert",
        },
      }));
      return 0;
    }
    if (message === "") {
      setValue((state: any) => ({
        ...state,
        message: { message: "Enter your message to send.", variant: "alert" },
      }));
      return 0;
    }
    const form = createForm({
      text: btoa(message),
      chatType,
      chat_text: 1,
      user_id: user.id,
    });
    await axios
      .post(VARS_.ROOT_URL + "/backend/chats.php", form)
      .then((res: any) => {
        res = res.data;
        console.log(res);
        if (res.message === "userNotFound") {
          setValue((state: any) => ({
            ...state,
            message: {
              message: "User id is incorrect please login again.",
              variant: "alert",
            },
          }));
        }
        if (res.message === "success") {
          const new_ = {
            userID: user.id,
            username: user.username,
            text: message,
            chatType: chatType,
            status: "1",
            bot_read_status: "not-read",
            reply: "",
            reply_date: "0000-00-00 00:00:00",
            replied: "0",
            msg_date: new Date(),
          };
          setChats([new_, ...chats]);
        }
        console.log(res);
      })
      .catch((error) => console.error(error));
  };
  const getChats = async (limit: number = 20) => {
    if (!user && !user.id) {
      setValue((state: any) => ({
        ...state,
        message: {
          message: "Please login before chatting.",
          variant: "danger",
        },
      }));
    }
    setLoading(true);
    await axios
      .get(VARS_.ROOT_URL + "/backend/chats.php", {
        params: { limit, getChats: 1, chatType: chatType, user_id: user.id },
      })
      .then((res: any) => {
        setLoading(false);
        console.log(res.data);
        res = res.data;
        setChats(res.chats);
        setTotalChats(res.total);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };
  useEffect(() => {
    getChats();
  }, [chatType]);
  return (
    <div className="container-fluid chat-co">
      <div className="row justify-content-center h-100 ">
        <div className="col-md-4 col-xl-3 chat">
          <div className="card mb-sm-3 mb-md-0 contacts_card">
            <div className="card-header">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search..."
                  name=""
                  className="form-control search"
                />
                <div className="input-group-prepend">
                  <span className="input-group-text search_btn">
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </div>
            </div>

            <div className="card-body contacts_body">
              <div className="contacts">
                <li
                  className={chatType === "chat-password-url" ? "active" : ""}
                >
                  <button
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                    }}
                    onClick={() => setChatType("chat-password-url")}
                  >
                    <div className="d-flex bd-highlight">
                      <div className="img_cont">
                        <img
                          src="./icons/key.svg"
                          className="rounded-circle user_img"
                          style={{
                            width: 50,
                            padding: 8,
                            background: getRandomColor(),
                            height: 50,
                            marginTop: "8px",
                          }}
                          alt="alter"
                        />
                      </div>
                      <div className="user_info" style={{ textAlign: "left" }}>
                        <span>Password URL</span>
                        <p>click to change chats to unlock urls</p>
                      </div>
                    </div>
                  </button>
                </li>
                <li className={chatType === "chat-unlock-url" ? "active" : ""}>
                  <button
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                    }}
                    onClick={() => setChatType("chat-unlock-url")}
                  >
                    <div className="d-flex bd-highlight ">
                      <div className="img_cont">
                        <img
                          src="./icons/url.svg"
                          className="rounded-circle user_img"
                          style={{
                            width: 50,
                            padding: 8,
                            background: getRandomColor(),
                            height: 50,
                            marginTop: "8px",
                          }}
                          alt="alter"
                        />
                      </div>
                      <div className="user_info" style={{ textAlign: "left" }}>
                        <span>Unlock URL</span>
                        <p>click to change chats to passwords urls</p>
                      </div>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                    }}
                    onClick={handleLogout}
                  >
                    <div className="d-flex bd-highlight ">
                      <div className="img_cont">
                        <img
                          src="./icons/logout.svg"
                          className="rounded-circle user_img"
                          style={{
                            width: 50,
                            padding: 8,
                            background: getRandomColor(),
                            height: 50,
                            marginTop: "8px",
                          }}
                          alt="alter"
                        />
                      </div>
                      <div className="user_info" style={{ textAlign: "left" }}>
                        <span>Logout</span>
                        <p>click to logout from your account.</p>
                      </div>
                    </div>
                  </button>
                </li>
              </div>
            </div>
            <div className="card-footer">
             <a href="//wa.me/447878659010/" target="_blank" style={{color: 'white', fontSize: 14}}>
             <img src="./icons/whatsapp.svg" alt="" style={{marginRight: 4, marginBottom: 3}}/>
                WhatsApps <span style={{color: '#ffaf0c', fontWeight: 600}}>+447878659010</span>
              </a> 
            </div>
          </div>
        </div>
        <div className="col-md-8 col-xl-6 chat">
          <div className="card">
            <div className="card-header msg_head">
              <div className="d-flex bd-highlight">
                <div className="img_cont">
                  <img
                    src={botAvatar}
                    className="rounded-circle user_img"
                    style={{
                      background: getRandomColor(),
                      padding: 9,
                      objectFit: "cover",
                    }}
                    alt="alter"
                  />
                  <span
                    className={`online_icon ${loading ? "active" : ""}`}
                  ></span>
                </div>
                <div className="user_info">
                  <span>Chat with Bot</span>
                  <p>{numberFormat(Number(totalChats))} Messages</p>
                </div>
              </div>
              <span id="action_menu_btn">
                <i className="fas fa-ellipsis-v"></i>
              </span>
              <div className="action_menu">
                <ul>
                  <li>
                    <i className="fas fa-user-circle"></i> View profile
                  </li>
                  <li>
                    <i className="fas fa-users"></i> Add to close friends
                  </li>
                  <li>
                    <i className="fas fa-plus"></i> Add to group
                  </li>
                  <li>
                    <i className="fas fa-ban"></i> Block
                  </li>
                </ul>
              </div>
            </div>
            <div className="card-body msg_card_body">
              {chats.map((chat: any, index: number) => {
                const chatsDate = new Date(chat.msg_date);
                const replyDate = new Date(chat.reply_date);
                const getHours = chatsDate.getHours() % 12 || 12;
                const minutes = chatsDate.getMinutes();
                const portion = chatsDate.getHours() < 12 ? "AM" : "PM";
                const seconds_ = replyDate.getSeconds();

                return (
                  <React.Fragment key={index}>
                    <div className="d-flex justify-content-start mb-4">
                      <div className="img_cont_msg">
                        {user.avatar && user.avatar != "" ? (
                          <img
                            alt="alter"
                            src={user.avatar}
                            className="rounded-circle user_img_msg"
                          />
                        ) : (
                          <div
                            className="rounded-circle user_img_msg xlze"
                            style={{ background: getRandomColor() }}
                          >
                            {setUserCharName(user.username)}
                          </div>
                        )}
                      </div>
                      <div className="msg_cotainer" style={{ minWidth: 150 }}>
                        {chat.text}
                        <span className="msg_time">
                          {life(chat.msg_date).format("D MM YYYY")},{" "}
                          {`${getHours}:${minutes} ${portion}`}
                        </span>
                      </div>
                    </div>
                    {chat.reply != "" ? (
                      <div
                        className="d-flex justify-content-end mb-4"
                        style={{ minWidth: 150 }}
                      >
                        <div
                          className="msg_cotainer_send"
                          style={{ minWidth: 150 }}
                        >
                          {chat.reply}
                          <span className="msg_time_send">
                            {`Replied after ${seconds_} seconds`}
                          </span>
                        </div>
                        <div className="img_cont_msg">
                          <img
                            alt="alter"
                            src={randomIcon()}
                            className="rounded-circle user_img_msg"
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <form onSubmit={handleMessage} id="msg-form">
              <div className="card-footer">
                <div className="input-group">
                  <div className="input-group-append">
                    <span className="input-group-text attach_btn">
                      <i className="fas fa-paperclip"></i>
                    </span>
                  </div>
                  <textarea
                    name="message"
                    className="form-control type_msg"
                    placeholder="Type your message..."
                  ></textarea>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      display: "inline",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    <div
                      className="input-group-append"
                      style={{ height: "100%" }}
                    >
                      <span className="input-group-text send_btn">
                        <i className="fas fa-location-arrow"></i>
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
