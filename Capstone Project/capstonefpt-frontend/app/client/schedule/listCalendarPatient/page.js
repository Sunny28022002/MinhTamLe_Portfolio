"use client";
import React, { useState, useEffect } from "react";
import { Calendar, DatePicker, RadioGroup, Radio } from "@douyinfe/semi-ui";
import axios from "axios";
import {
  headerConfig,
  userServiceAPI,
  scheduleServiceAPI,
} from "@/libs/highmedicineapi";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Cookies from "js-cookie";

const PatientScheduleListPage = () => {
  const [mode, setMode] = useState("week");
  const [displayValue, setDisplayValue] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  let userId = Cookies.get("userId");

  useEffect(() => {
    axios
      .get(`${scheduleServiceAPI}/Schedule/getWattingConfirmSchedule/patientId?id=${userId}`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log("Schedule", response.data.data)
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

  const getNameById = (arr, targetIndex) => {
    if (arr.length === 0) {
      return null; // or any other value or indication of not found
    }

    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
      return targetObject.username;
    } else {
      return null; // or any other value or indication of not found
    }
  };

  const isMonthView = mode === "month";
  const isDayView = mode === "day";
  const MonthView =
    "rounded-md h-full text-center border-box border-solid border-primary texl-2xl w-full overflow-hidden";
  const WeekView =
    "rounded-md h-full text-center border-box border-solid border-primary p-1.5 overflow-hidden";
  const DayView =
    "rounded-md h-full text-center border-box border-solid border-primary overflow-hidden text-lg";
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
          item.isAccepted ? acceptedStyle : notAcceptedStyle
        }`}
      >
        <p>
          {item.startShift} ~ {item.endShift}
        </p>
        <p>
          <p>
            Doctor: {doctors.length > 0 && getNameById(doctors, item.doctorId)}
          </p>
        </p>
      </div>
    ),
  }));

  return (
    <SemiLocaleProvider locale={en_US}>
      <div className="flex flex-col items-start h-full w-full">
        <HeaderAdminManagementComponent content={"Schedule List"} />
        <RadioGroup
          className="mt-5"
          onChange={(e) => onSelect(e)}
          value={mode}
          type="button"
        >
          <Radio value={"day"}>Day view</Radio>
          <Radio value={"week"}>Week view</Radio>
          <Radio value={"month"}>Month view</Radio>
          {/*<Radio value={"range"}>Multi-day view</Radio>*/}
        </RadioGroup>
        <div className="mt-5">
          <DatePicker value={displayValue} onChange={(e) => onChangeDate(e)} />
        </div>
        <div className="flex justify-center items-center p-10 ">
          <Calendar
            width={1400}
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

export default PatientScheduleListPage;
