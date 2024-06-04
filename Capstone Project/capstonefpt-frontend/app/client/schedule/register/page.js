"use client";
import { Avatar, Tag, Tooltip } from "@douyinfe/semi-ui";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Modal, Button, Card, Space, Spin } from "@douyinfe/semi-ui";
import {
  headerConfig,
  userServiceAPI,
  scheduleServiceAPI,
} from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { Toast } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { Calendar, DatePicker, RadioGroup, Radio } from "@douyinfe/semi-ui";

const ScheduleListClientPage = () => {
  const [user, setUser] = useState([]);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scheduleRegister, setScheduleRegister] = useState({});
  const [scheduleList, setScheduleList] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const userId = Cookies.get("userId");
  const pageSize = 10;
  const { Meta } = Card;

  //for schedule
  const [mode, setMode] = useState("week");
  const [displayValue, setDisplayValue] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  //for schedule
  const onSelect = (e) => {
    setMode(e.target.value);
  };

  const onChangeDate = (e) => {
    setDisplayValue(e);
  };

  const handleStartTime = (item) => {
    if (typeof item !== "object" || item === null) {
      return;
    }
    let date = item.date;
    let startShift = item.startShift;
    const [datePart] = date.split("T");
    const dateTimeString = datePart + "T" + startShift;
    return new Date(dateTimeString);
  };

  const handleEndTime = (item) => {
    if (typeof item !== "object" || item === null) {
      return;
    }
    let date = item.date;
    let endShift = item.endShift;
    const [datePart] = date.split("T");
    const dateTimeString = datePart + "T" + endShift;
    return new Date(dateTimeString);
  };

  const isMonthView = mode === "month";
  const isDayView = mode === "day";
  const MonthView =
    "rounded-md h-fit text-center border-box border-solid border-primary texl-3xl w-full overflow-hidden flex justify-center items-center";
  const WeekView =
    "rounded-md h-full text-center border-box border-solid border-primary overflow-hidden flex justify-center items-center";
  const DayView =
    "rounded-md h-full text-center border-box border-solid border-primary overflow-hidden text-lg  flex justify-center items-center";
  const acceptedStyle = "bg-green-500";
  const notAcceptedStyle = "bg-blue-200";
  const dailyStyle = isMonthView ? MonthView : isDayView ? DayView : WeekView;

  const events = schedule.map((item) => ({
    key: item.scheduleId.toString(),
    start: handleStartTime(item),
    end: handleEndTime(item),
    children: (
      <div
        className={`${dailyStyle} ${
          item?.isAccepted ? acceptedStyle : notAcceptedStyle
        }`}
      >
        <div>
          <Tooltip
            position="topLeft"
            content={` Time: ${item?.startShift} ~ ${item?.endShift}`}
          >
            {item.doctorName ? (
              <Tag
                type="primary"
                style={{ fontSize: "1rem", marginBottom: "5px" }}
              >
                Doctor: {item.doctorName}
              </Tag>
            ) : (
              <Tag
                type="primary"
                style={{ fontSize: "1rem", marginBottom: "5px" }}
              >
                Doctor: (Empty)
              </Tag>
            )}
          </Tooltip>
        </div>
      </div>
    ),
  }));

  // toast
  let toast = {
    content: "",
    duration: 3,
  };

  //handle modal state
  const showDialog = (scheduleId) => {
    setVisible(true);
    setScheduleRegister({
      scheduleId: scheduleId,
      patientId: userId,
    });
  };

  const handleOk = () => {
    setSpinner(true);
    axios
      .put(`${scheduleServiceAPI}/Schedule/Register`, scheduleRegister, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        toast.content = response.data.message;
        Toast.success(toast);
        setScheduleRegister({});
        setVisible(false);
        setSpinner(false);
      })
      .catch((error) => {
        // Handle error.
        console.log("An error occurred:", error.response);
        toast.content = error.response.data.message;
        Toast.error(toast);
      });
  };

  const handleCancel = () => {
    setScheduleRegister({});
    setVisible(false);
  };

  const getValueByIndex = (arr, targetIndex) => {
    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
      return targetObject.username;
    } else {
      return null; // or any other value or indication of not found
    }
  };

  const getMajorByIndex = (arr, targetIndex) => {
    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
      return targetObject.major;
    } else {
      return null; // or any other value or indication of not found
    }
  };

  const getWorkPlaceByIndex = (arr, targetIndex) => {
    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
      return targetObject.workPlace;
    } else {
      return null; // or any other value or indication of not found
    }
  };

  const getExperienceByIndex = (arr, targetIndex) => {
    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
      return targetObject.experience;
    } else {
      return null; // or any other value or indication of not found
    }
  };

  const sliceTime = (time) => {
    let timeString = time;
    let splitTime = timeString.split(":");
    let convertedTime = splitTime.slice(0, 2).join(":");
    return convertedTime;
  };

  useEffect(() => {
    axios
      .get(`${userServiceAPI}/Authentication/Doctors`, {
        headers: headerConfig,
      })
      .then((response) => {
        setUser(response.data.data);
        setDoctors(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
    axios
      .get(`${scheduleServiceAPI}/Schedule/GetEmptySchedule`, {
        headers: headerConfig,
      })
      .then((response) => {
        if (JSON.stringify(response.data.data) == "[]") {
          setIsEmptyData(true);
        } else {
          setScheduleList(response.data.data);
          setSchedule(response.data.data);
          setIsEmptyData(false);
          setSpinner(false);
        }
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
    axios
      .get(`${userServiceAPI}/Authentication/Patients`, {
        headers: headerConfig,
      })
      .then((response) => {
        setPatients(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
  }, []);

  return (
    <SemiLocaleProvider locale={en_US}>
      <div className="flex flex-col items-center w-full p-8 mb-4">
        {/* -------- Title -------- */}
        <HeaderAdminManagementComponent content={"Register Schedule"} />
        {/* Table */}
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
          <div className="flex flex-wrap w-full justify-start px-8">
            {spinner ? (
              <div className="flex w-full justify-center items-center gap-4 mt-6">
                <Spin aria-label="Spinner button example" />
              </div>
            ) : (
              scheduleList.map((schedule, index) => (
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
                      title={"Dr " + getValueByIndex(user, schedule.doctorId)}
                      description={getMajorByIndex(user, schedule.doctorId)}
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
                        onClick={() => showDialog(schedule.scheduleId)}
                        theme="borderless"
                        type="danger"
                        style={{ height: 50, fontSize: 18 }}
                      >
                        Register
                      </Button>
                    </Space>
                  }
                >
                  <div className="grid grid-cols-2">
                    <div>
                      <p>Date</p>
                      <p className="font-semibold">
                        {new Date(schedule.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p>Time</p>
                      <p className="font-semibold">
                        {" "}
                        {sliceTime(schedule.startShift)} -{" "}
                        {sliceTime(schedule.endShift)}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p>Workplace</p>
                      <p className="font-semibold">
                        {getWorkPlaceByIndex(user, schedule.doctorId)}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p>Experience</p>
                      <p className="font-semibold">
                        {getExperienceByIndex(user, schedule.doctorId)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}

            <div className="flex flex-col p-8 h-full w-full justify-items-center items-center">
              <h1 className="mb-4 text-2xl px-10 font-extrabold text-gray-900 dark:text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                  View Schedule List
                </span>{" "}
                By Calendar
              </h1>
              <RadioGroup
                className="mt-5"
                onChange={(e) => onSelect(e)}
                value={mode}
                type="button"
              >
                <Radio value={"day"}>Day view</Radio>
                <Radio value={"week"}>Week view</Radio>
                <Radio value={"month"}>Month view</Radio>
              </RadioGroup>
              <div className="mt-5">
                <DatePicker
                  value={displayValue}
                  onChange={(e) => onChangeDate(e)}
                />
              </div>
              <div className="flex justify-center items-center">
                <Calendar
                  width={1200}
                  height={600}
                  mode={mode}
                  displayValue={displayValue}
                  events={events}
                  minEventHeight={40}
                  range={
                    mode === "range"
                      ? [new Date(2023, 11, 21), new Date(2023, 11, 28)]
                      : []
                  }
                ></Calendar>
              </div>
            </div>
          </div>
        )}
        <Modal
          title="Register Confirm"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
          bodyStyle={{ overflow: "auto", height: 100 }}
          cancelText="Cancel"
          okText="Confirm"
        >
          <p style={{ lineHeight: 1.8 }}>
            Are you sure you want to register this schedule?
          </p>
        </Modal>
      </div>
    </SemiLocaleProvider>
  );
};

export default ScheduleListClientPage;
