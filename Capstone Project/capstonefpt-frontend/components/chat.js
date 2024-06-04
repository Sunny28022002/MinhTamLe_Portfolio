"use client";
import React, { useEffect } from "react";
import MessageContainer from "./messageContainer";
import SendMessageForm from "./sendMessageForm";
import ConnectedUsers from "./connectedUser";
import { getUserNameFromToken } from "@/libs/common";
import Cookies from "js-cookie";
import { Avatar } from "@douyinfe/semi-ui";

const Chat = ({ messages, sendMessage, closeConnection, users, chatId }) => {
  let token = Cookies.get("token");
  const userNameFromToken = getUserNameFromToken(token);

  const receiverName = users.filter(
    (username) => username !== userNameFromToken
  );

  const receiverNameString = receiverName[0];

  console.log(typeof receiverNameString);

  return (
    <div className="w-[95%] mt-5">
      <ConnectedUsers users={users} />
      <div className="flex flex-col h-full">
        <div
          className="bg-white border-solid border-[1px] w-full text-left h-16 p-[16px] font-bold rounded-t-lg 
drop-shadow-lg"
        >
          <div className="text-right -mt-2">
            <button
              onClick={() => closeConnection()}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Leave Room
            </button>
          </div>
        </div>
        <MessageContainer messages={messages} />
        <SendMessageForm
          sendMessage={sendMessage}
          chatId={chatId}
          users={users}
        />
      </div>
    </div>
  );
};

export default Chat;
