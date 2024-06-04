"use client";
import React, { useState, useEffect, useRef } from "react";
import { Avatar, Toast } from "@douyinfe/semi-ui";
import { useFormik } from "formik";
import * as Yup from "yup";
import { VscSend } from "react-icons/vsc";
import Cookies from "js-cookie";
import { AIServices, headerConfig } from "@/libs/highmedicineapi";
import axios from "axios";
import AIMessage from "@/components/aiMessage";

const HelperWithAIPage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null); // Ref to the latest message for scrolling

  // Scroll to bottom whenever chatHistory updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: Yup.object({
      // Validation schema here
    }),
    onSubmit: (values, { resetForm }) => {
      let userMessage = {
        user: "user",
        message: values.message,
      };

      // Update chat history in an immutable way
      setChatHistory((currentChatHistory) => [
        ...currentChatHistory,
        userMessage,
      ]);

      axios
        .post(
          `${AIServices}?input_text=${values.message}`,
          {},
          {
            headers: headerConfig,
          }
        )
        .then((response) => {
          let botMessage = response.data.predictions[0]
            ? response.data.predictions[0]
            : "Server error, please try again.";

          // Immutable update with new bot message
          setChatHistory((currentChatHistory) => [
            ...currentChatHistory,
            { user: "bot", message: botMessage },
          ]);

          // Optionally, reset the form here
          resetForm({});
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    },
  });

  return (
    <div className="flex flex-col w-full h-[100vh] overflow-y-scroll">
      <div className="p-4">
        <h1 className="text-3xl text-center font-extrabold text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-600 from-red-400">
            AI Assistant
          </span>{" "}
        </h1>
      </div>
      <div className="flex w-full items-center overflow-y-scroll justify-center">
        <div className="flex flex-col justify-center items-center px-8 py-6">
          <div className="w-full min-h-[70vh] mb-2">
            <AIMessage data={chatHistory} />
            <div ref={messagesEndRef} />
          </div>
          <div className="w-full">
            <form onSubmit={formik.handleSubmit} className="w-full">
              <div className="flex w-full justify-center items-center gap-2">
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Enter your disease symptoms..."
                    className="w-full min-w-[40rem] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.message}
                    name="message"
                    id="message"
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    height: "40px",
                    backgroundColor: "#4361EE",
                    color: "#FFFFFF",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    transition: "all 0.3s",
                  }}
                  className="flex flex-col justify-center items-center hover:bg-blue-500 hover:text-white transition-all duration-300 w-12"
                >
                  <VscSend className="text-lg" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperWithAIPage;
