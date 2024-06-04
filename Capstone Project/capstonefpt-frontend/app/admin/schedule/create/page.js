"use client";
import React, { useState, useEffect } from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  headerConfig,
  userServiceAPI,
  scheduleServiceAPI,
  adminRole,
} from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { AutoComplete, Select, Tag } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";
import { Avatar } from "@douyinfe/semi-ui/lib/es/skeleton/item";
//for schedule
import { Calendar, DatePicker, RadioGroup, Radio } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { Tooltip } from "@douyinfe/semi-ui";

const CreateSchedulePage = () => {
  const [spinner, setSpinner] = useState(false);
  const router = useRouter();
  let [doctors, setDoctors] = useState(null);
  const [doctorOptions, setDoctorOptions] = useState([]);
  let [patients, setPatients] = useState(null);
  const [patientOptions, setPatientOptions] = useState([]);
  const color = ["amber", "indigo", "cyan"];

  //for schedule
  const [mode, setMode] = useState("week");
  const [displayValue, setDisplayValue] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  let toast = {
    content: "",
    duration: 3,
  };

  useEffect(() => {
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
  }, []);

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
    "rounded-md h-full text-center border-box border-solid border-primary texl-1xl w-full overflow-hidden flex justify-center items-center";
  const WeekView =
    "rounded-md h-full text-center border-box border-solid border-primary overflow-hidden flex justify-center items-center";
  const DayView =
    "rounded-md h-full text-center border-box border-solid border-primary overflow-hidden text-lg flex justify-center items-center";
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

  const formik = useFormik({
    initialValues: {
      doctorId: "",
      patientId: "",
      date: "",
      startShift: "",
      endShift: "",
    },
    validationSchema: Yup.object({
      doctorId: Yup.number().required("Doctor is required"),
      patientId: Yup.number().required("Patient is required"),
      date: Yup.date().required("Date is required"),
      startShift: Yup.string().required("Start Shift is required"),
      endShift: Yup.string().required("End Shift is required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .post(`${scheduleServiceAPI}/Schedule/Create`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Create successfull: ", response.data.message);
          toast.content = response.data.message;
          if (response.data.status == 404) {
            Toast.error(toast);
            setSpinner(false);
          } else {
            Toast.success(toast);
            router.push("/admin/schedule/list");
          }
        })
        .catch((error) => {
          console.log("An error occurred:", error.response.data.message);
          toast.content = error.response.data.message;
          Toast.error(toast);
          setSpinner(false);
        });
    },
  });

  const searchDoctorOptions = (value) => {
    let result;
    if (value) {
      result = doctors.map((item) => {
        return { ...item, value: item.userId, label: item.username };
      });
    } else {
      result = [];
    }
    setDoctorOptions(result);
  };

  const renderDoctorOption = (item) => {
    return (
      <>
        <Avatar color={"indigo"} size="small">
          {item.userId}
        </Avatar>
        <div style={{ marginLeft: 4 }}>
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.fullname}</div>
        </div>
      </>
    );
  };

  const searchPatientOptions = (value) => {
    let result;
    if (value) {
      result = patients.map((item) => {
        return { ...item, value: item.userId, label: item.fullname };
      });
    } else {
      result = [];
    }
    setPatientOptions(result);
  };

  const renderPatientOption = (item) => {
    return (
      <>
        <div style={{ marginLeft: 4 }}>
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.fullname}</div>
        </div>
      </>
    );
  };

  return (
    <>
      {spinner ? (
        <div className="flex w-full justify-center items-center gap-4">
          <Spin aria-label="Spinner button example" />
        </div>
      ) : (
        <SemiLocaleProvider locale={en_US}>
          <div className="flex flex-col my-7 items-center w-5/6">
            <HeaderAdminManagementComponent content={"Create Schedule"} />
            <form
              className="grid grid-cols-2 mt-10 gap-5 w-5/6"
              onSubmit={formik.handleSubmit}
            >
              <div className="col-span-1">
                <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                  Doctor
                </p>
                <AutoComplete
                  data={doctorOptions}
                  style={{
                    width: "100%",
                    border: "1px solid",
                    borderRadius: "0.375rem",
                    outline: "none",
                    borderColor: "#D1D5DB",
                    backgroundColor: "#DEE4FF",
                    height: "34px",
                    fontWeight: "600",
                    marginTop: "-2px",
                  }}
                  className=""
                  renderSelectedItem={(option) => option.username}
                  renderItem={renderDoctorOption}
                  onSearch={searchDoctorOptions}
                  onSelect={(v) => formik.setFieldValue("doctorId", v)}
                ></AutoComplete>

                {formik.touched.doctorId && formik.errors.doctorId ? (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    {formik.errors.doctorId}
                  </div>
                ) : null}
              </div>
              <div className="col-span-1">
                <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                  Patient
                </p>
                <AutoComplete
                  data={patientOptions}
                  style={{
                    width: "100%",
                    border: "1px solid",
                    borderRadius: "0.375rem",
                    outline: "none",
                    borderColor: "#D1D5DB",
                    backgroundColor: "#DEE4FF",
                    height: "34px",
                    fontWeight: "600",
                    marginTop: "-2px",
                  }}
                  className=""
                  renderSelectedItem={(option) => option.username}
                  renderItem={renderPatientOption}
                  onSearch={searchPatientOptions}
                  onSelect={(v) => formik.setFieldValue("patientId", v)}
                ></AutoComplete>

                {formik.touched.patientId && formik.errors.patientId ? (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    {formik.errors.patientId}
                  </div>
                ) : null}
              </div>

              <div className="col-span-1">
                <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                  Start Shift
                </p>
                <input
                  type="time"
                  placeholder="Enter Start Shift"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  style={{ backgroundColor: "#DEE4FF" }}
                  onChange={(e) => {
                    // Format the time to HH:mm:ss
                    formik.handleChange(e);
                    const formattedTime = e.target.value + ":00";
                    formik.setFieldValue("startShift", formattedTime);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.startShift}
                  name="startShift"
                  id="startShift"
                />
                {formik.touched.startShift && formik.errors.startShift ? (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    {formik.errors.startShift}
                  </div>
                ) : null}
              </div>
              <div>
                <div className="col-span-1">
                  <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                    End Shift
                  </p>
                  <input
                    type="time"
                    placeholder="Enter End Shift"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    style={{ backgroundColor: "#DEE4FF" }}
                    onChange={(e) => {
                      // Format the time to HH:mm:ss
                      formik.handleChange(e);
                      const formattedTime = e.target.value + ":00";
                      formik.setFieldValue("endShift", formattedTime);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.endShift}
                    name="endShift"
                    id="endShift"
                  />
                  {formik.touched.endShift && formik.errors.endShift ? (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      {formik.errors.endShift}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-span-1">
                <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                  Date
                </p>
                <input
                  type="date"
                  placeholder="Enter Date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  style={{ backgroundColor: "#DEE4FF" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.date}
                  name="date"
                  id="date"
                />
                {formik.touched.date && formik.errors.date ? (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    {formik.errors.date}
                  </div>
                ) : null}
              </div>
              <div></div>
              <div className="space-x-10 mt-5">
                <button
                  type="submit"
                  style={{
                    width: "33.33%",
                    height: "3rem",
                    backgroundColor: "#4361EE",
                    color: "#FFFFFF",
                    borderRadius: ".75rem",
                    fontWeight: "bold",
                    transition: "all 0.3s",
                  }}
                  className="hover:bg-blue-500 hover:text-white transition-all duration-300"
                >
                  Create
                </button>
                <Link href="/admin/schedule/list">
                  <button
                    type="button"
                    style={{
                      width: "33.33%",
                      height: "3rem",
                      backgroundColor: "#F1F3F5",
                      color: "#495057",
                      borderRadius: ".75rem",
                      fontWeight: "bold",
                      transition: "all 0.3s",
                    }}
                    className="hover:bg-gray-400 hover:text-content-neutral-2 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
            <div className="flex flex-col items-start p-8 h-full w-full justify-items-center items-center">
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
              <div className="flex justify-center items-center p-10 ">
                <Calendar
                  width={1200}
                  height={400}
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
        </SemiLocaleProvider>
      )}
    </>
  );
};

export default withAuth(CreateSchedulePage, adminRole);
