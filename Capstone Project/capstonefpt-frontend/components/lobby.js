"use client";
import { Avatar, Table } from "@douyinfe/semi-ui";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Modal, Button, Card, Space, Spin } from "@douyinfe/semi-ui";
import { headerConfig, userServiceAPI } from "@/libs/highmedicineapi";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { getUserNameFromToken, getRoleFromToken } from "@/libs/common";
import Image from "next/image";
import chatDoctorScreen from "@/public/staticImage/chatDoctorScreen.jpg";

const Lobby = ({ joinRoom, setCurrentChatId }) => {
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState(null);
  const [doctors, setDoctors] = useState(null);
  const [joinRoomObj, setJoinRoomObj] = useState({});
  const [spinner, setSpinner] = useState(true);
  const userId = Cookies.get("userId");
  let token = Cookies.get("token");
  const userNameFromToken = getUserNameFromToken(token);
  const roleFromToken = getRoleFromToken(token);
  const { Meta } = Card;

  //handle modal state
  const showDialog = (username) => {
    setVisible(true);
    setJoinRoomObj({
      username: getValueByIndex(users, userId),
      room: username,
    });
  };

  const handleOk = () => {
    //get doctor by username
    const selectedDoctor = doctors.find(
      (doctor) => doctor.username === joinRoomObj.room
    );

    axios
      .post(
        `http://localhost:5207/api/Chat/CreateChatRoom?patientId=${userId}&doctorId=${selectedDoctor.userId}`,
        null,
        {
          headers: headerConfig,
        }
      )
      .then((response) => {
        setCurrentChatId(response.data.data.chatId); // Set the chatId
        setJoinRoomObj({});
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    joinRoom(joinRoomObj.username, joinRoomObj.room);
  };

  const handleJoinDoctorRoom = () => {
    axios
      .post(
        `http://localhost:5207/api/Chat/CreateChatRoom?patientId=${userId}&doctorId=${userId}`,
        null,
        {
          headers: headerConfig,
        }
      )
      .then((response) => {
        setCurrentChatId(response.data.data.chatId); // Set the chatId
        setJoinRoomObj({});
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
    joinRoom(userNameFromToken, userNameFromToken);
  }

  const handleCancel = () => {
    setJoinRoomObj({});
    setVisible(false);
  };

  const getValueByIndex = (arr, targetIndex) => {
    let targetObject = arr.find((obj) => obj.userId == targetIndex);

    if (targetObject) {
      return targetObject.username;
    } else {
      return null; // or any other value or indication of not found
    }
  };

  useEffect(() => {
    axios
      .get(`${userServiceAPI}/Authentication/Users`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
    axios
      .get(`${userServiceAPI}/Authentication/Doctors`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setDoctors(response.data.data);
        setSpinner(false);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
  }, []);

  return (
    <SemiLocaleProvider locale={en_US}>
      <div className="flex flex-col items-center w-full p-8 mb-4">
        {isEmptyData ? (
          <>
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-center">
                <div className="font-bold mb-4">
                  No information available to display
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap w-full justify-center">
            {spinner ? (
              <div className="flex w-full justify-center items-center gap-4 mt-6">
                <Spin aria-label="Spinner button example" />
              </div>
            ) : roleFromToken === "Doctor" ? (
              <div className="flex flex-col justify-center items-center text-center gap-4">
                <div className="">
                  <p className="text-4xl font-semibold">
                    Online Consulting Channel
                  </p>
                </div>
                <div className="">
                  <p className="text-xl">
                    The good physician treats the disease; the great physician
                    treats the patient who has the disease.
                  </p>
                </div>
                <button
                  onClick={() => handleJoinDoctorRoom()}
                  className="px-4 py-2 bg-bg-neutral-4 text-white rounded-md font-semibold"
                >
                  Join My Room
                </button>
                <div className="">
                  <Image
                    src={chatDoctorScreen}
                    loading="lazy"
                    width={300}
                    height={300}
                    alt="Image 1"
                    style={{ borderRadius: 8 }}
                  />
                </div>
              </div>
            ) : (
              doctors.map((doctor, index) => (
                <Card
                  key={index}
                  style={{
                    maxWidth: 400,
                    width: 364,
                    marginTop: 16,
                    marginRight: 16,
                  }}
                  title={
                    <Meta
                      title={"Dr " + doctor.fullname}
                      description={doctor.major}
                      avatar={
                        <Avatar
                          alt="Card meta img"
                          size="default"
                          src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg"
                        />
                      }
                    />
                  }
                  footerLine={true}
                  footerStyle={{ display: "flex", justifyContent: "flex-end" }}
                  footer={
                    <Space>
                      <Button
                        onClick={() => showDialog(doctor.username)}
                        theme="borderless"
                        type="primary"
                        style={{ height: 50, fontSize: 18 }}
                      >
                        Starting chat with Doctor
                      </Button>
                    </Space>
                  }
                >
                  <div className="grid grid-cols-2">
                    <div>
                      <p>Workplace</p>
                      <p className="font-semibold">{doctor.workPlace}</p>
                    </div>
                    <div>
                      <p>Experience</p>
                      <p className="font-semibold">{doctor.experience}</p>
                    </div>
                    <div className="mt-2">
                      <p>Phone Number</p>
                      <p className="font-semibold">{doctor.phoneNumber}</p>
                    </div>
                    <div className="mt-2">
                      <p>Emergency Contact</p>
                      <p className="font-semibold">
                        <p className="font-semibold">
                          {doctor.emergencyContact}
                        </p>
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
        <Modal
          title="Join Room Confirm"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
          bodyStyle={{ overflow: "auto", height: 100 }}
          cancelText="Cancel"
          okText="Join"
        >
          <p style={{ lineHeight: 1.8 }}>
            Are you sure you want to join this room?
          </p>
        </Modal>
      </div>
    </SemiLocaleProvider>
  );
};

export default Lobby;
