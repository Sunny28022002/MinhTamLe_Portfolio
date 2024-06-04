"use client";
import Lobby from "@/components/lobby";
import React, { useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Chat from "@/components/chat";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import axios from "axios";
import { headerConfig, userServiceAPI } from "@/libs/highmedicineapi";
import Cookies from "js-cookie";
import { getRoleFromToken } from "@/libs/common";

const ChatApp = () => {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(0); // State to hold chatId
  let token = Cookies.get("token");
  const roleFromToken = getRoleFromToken(token);

  const joinRoom = async (user, room) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5207/chat")
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveMessage", (user, message) => {
        setMessages((messages) => [...messages, { user, message }]);
      });

      connection.on("UsersInRoom", (users) => {
        setUsers(users);
      });

      connection.onclose((e) => {
        setConnection();
        setMessages([]);
        setUsers([]);
        setCurrentChatId(0);
      });

      await connection.start();
      await connection.invoke("JoinRoom", { user, room });
      setConnection(connection);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async () => {
    try {
      axios
        .put(`${userServiceAPI}/Chat/EndChat?chatId=${currentChatId}`, null, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log(response.data.data);
        })
        .catch((error) => {
          console.log("An error occurred:", error.response);
        })
        .finally(() => {});
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-8">
      {roleFromToken === "Doctor" ? (
        ""
      ) : (
        <HeaderAdminManagementComponent content={"Online Consulting Channel"} />
      )}
      {!connection ? (
        <Lobby joinRoom={joinRoom} setCurrentChatId={setCurrentChatId} />
      ) : (
        <Chat
          messages={messages}
          sendMessage={sendMessage}
          closeConnection={closeConnection}
          users={users}
          chatId={currentChatId}
        />
      )}
    </div>
  );
};

export default ChatApp;
