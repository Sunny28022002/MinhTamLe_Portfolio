"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  DatePicker,
  RadioGroup,
  Radio,
  Tooltip,
  Tag,
} from "@douyinfe/semi-ui";
import axios from "axios";
import {
  headerConfig,
  userServiceAPI,
  scheduleServiceAPI,
} from "@/libs/highmedicineapi";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";

const ScheduleListPage = () => {
  const [mode, setMode] = useState("week");
  const [displayValue, setDisplayValue] = useState(new Date());
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    axios
      .get(`${scheduleServiceAPI}/Schedule`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log("Schedule", response.data.data);
        setSchedule(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        setLoading(false);
      });

    axios
      .get(`${userServiceAPI}/Authentication/Doctors`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setDoctors(response.data.data);
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
        console.log(response.data.data);
        setPatients(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
  }, []);

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

  return (
    <SemiLocaleProvider locale={en_US}>
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
          <DatePicker value={displayValue} onChange={(e) => onChangeDate(e)} />
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
    </SemiLocaleProvider>
  );
};

export default ScheduleListPage;
