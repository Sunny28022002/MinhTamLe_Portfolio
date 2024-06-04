"use client";
import React, { useEffect, useRef } from "react";
import { Avatar } from "@douyinfe/semi-ui";
import { getUserNameFromToken } from "@/libs/common";
import Cookies from "js-cookie";

const MessageContainer = ({ messages }) => {
  const messageRef = useRef();
  let token = Cookies.get("token");
  const userNameFromToken = getUserNameFromToken(token);

  useEffect(() => {
    if (messageRef && messageRef.current) {
      const { scrollHeight, clientHeight } = messageRef.current;
      messageRef.current.scrollTo({
        left: 0,
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="h-[500px] pb-72 bg-white overflow-auto rounded-b-lg mb-2 border-solid border-[1px]">
      {messages.map((m, index) => {
        if (m.user === "System") {
          return (
            <div key={index} className="text-center pr-5 text-lg">
              <div className="inline-flex mx-auto py-1 px-2 text-sm text-gray-400 rounded-full mt-3">
                <div>{m.message}</div>
              </div>
            </div>
          );
        } else {
          if (m.user === userNameFromToken) {
            return (
              <div key={index} className="text-right pr-5 text-lg">
                <div className="bg-bg-neutral-4 inline-flex mx-auto py-1 px-2 text-base text-white rounded-full mt-3">
                  <div>{m.message}</div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className="text-left pr-5 text-lg mt-4 ml-2">
                <div className="inline-flex">
                  <Avatar size="small" style={{ margin: 4 }} alt={m.user}>
                    {m.user[0].toUpperCase()}
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="text-sm mb-2 ml-1 text-gray-400">
                      {m.user}
                    </div>
                    <div className="bg-gray-200 inline-flex mr-auto py-1 px-2 text-base text-black rounded-full">
                      <div>{m.message}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        }
      })}
    </div>
  );
};

export default MessageContainer;
