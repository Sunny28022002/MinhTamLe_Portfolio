"use client";
import { Formik, Form, Field } from "formik";
import React, { useState, useEffect } from "react";
import { headerConfig, userServiceAPI } from "@/libs/highmedicineapi";
import axios from "axios";
import Cookies from "js-cookie";
import { Toast } from "@douyinfe/semi-ui";

const SendMessageForm = ({ sendMessage, chatId, users }) => {
  const [userList, setUserList] = useState([]);
  const userId = Cookies.get("userId");
  let saveMessage = {
    chatId: "",
    receiverId: "",
    senderId: "",
    message: "",
  };
  let toast = {
    content: "",
    duration: 5,
  };

  useEffect(() => {
    axios
      .get(`${userServiceAPI}/Authentication/Users`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setUserList(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
  }, []);

  return (
    <Formik
      initialValues={{ message: "" }}
      onSubmit={(values, actions) => {
        console.log(users.length);
        if (users.length < 2) {
          console.log(1);
          toast.content =
            "The task cannot currently be performed because the user has not joined the chat room!";
          Toast.error(toast);
        } else {
          //get user by id
          const selectedUser = userList.find(
            (user) => user.userId.toString() === userId
          );

          //get receiver name
          const receiverName = users.filter(
            (username) => username !== selectedUser.username
          );

          //get user by username
          const receiverObject = userList.find(
            (user) => user.username === receiverName[0]
          );

          saveMessage.chatId = chatId;
          saveMessage.senderId = parseInt(userId);
          saveMessage.receiverId = receiverObject.userId;
          saveMessage.message = values.message;

          console.log(saveMessage)

          axios
            .post(`${userServiceAPI}/Chat/Save`, saveMessage, {
              headers: headerConfig,
            })
            .then((response) => {
              console.log("Create successfull: ", response.data.data);
            })
            .catch((error) => {
              console.log("An error occurred:", error.response.data.data);
            });
          sendMessage(values.message);
          actions.resetForm();
        }
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="flex">
            <Field
              type="text"
              name="message"
              placeholder="Message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md"
            >
              Send
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SendMessageForm;
