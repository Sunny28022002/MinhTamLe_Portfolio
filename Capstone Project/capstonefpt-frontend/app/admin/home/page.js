"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  SideSheet,
  Calendar,
  DatePicker,
  Radio,
  RadioGroup,
  Table,
  Tag,
  Tooltip,
} from "@douyinfe/semi-ui";
import Link from "next/link";
import { Toast, Spin } from "@douyinfe/semi-ui";
import { FaRegMessage, FaUserDoctor, FaUserGroup } from "react-icons/fa6";
import {
  FaBook,
  FaBookMedical,
  FaBriefcaseMedical,
  FaCalendarAlt,
  FaCommentAlt,
  FaPager,
  FaPills,
  FaUserCog,
  FaUserNurse,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";
import { VChart } from "@visactor/react-vchart";
import {
  headerConfig,
  medicineServiceAPI,
  tempMedicineServiceAPI,
  tempUserServiceAPI,
  userServiceAPI,
  scheduleServiceAPI,
} from "@/libs/highmedicineapi";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";

export default function AdminHome() {
  const [spinner, setSpinner] = useState(false);
  const [visibleUserSideSheet, setVisibleUserSideSheet] = useState(false);
  const [visibleFeedbackSideSheet, setVisibleFeedbackSideSheet] =
    useState(false);
  const [visibleScheduleSideSheet, setVisibleScheduleSideSheet] =
    useState(false);
  const [visibleMedicineSideSheet, setVisibleMedicineSideSheet] =
    useState(false);

  const toggleUserSideSheet = () => {
    setVisibleUserSideSheet(!visibleUserSideSheet);
  };

  const toggleFeedbackSideSheet = () => {
    setVisibleFeedbackSideSheet(!visibleFeedbackSideSheet);
  };

  const toggleScheduleSideSheet = () => {
    setVisibleScheduleSideSheet(!visibleScheduleSideSheet);
  };

  const toggleMedicineSideSheet = () => {
    setVisibleMedicineSideSheet(!visibleMedicineSideSheet);
  };
  //forSchedule
  const [mode, setMode] = useState("week");
  const [displayValue, setDisplayValue] = useState(new Date());
  const [schedule, setSchedule] = useState([]);

  const handleClick = () => {
    setSpinner(true);
    setTimeout(() => {
      setSpinner(false);
    }, 2000);
  };
  //Charts
  const [
    loadingExaminatedRecordStatistic,
    setLoadingExaminatedRecordStatistic,
  ] = useState(false);

  const [examinatedRecordStatistic, setExaminatedRecordStatistic] = useState(
    {}
  );
  const [totalActiveMedicine, setTotalActiveMedicine] = useState(0);
  const [loadingTotalActiveMedicine, setLoadingTotalActiveMedicine] =
    useState(false);
  const [totalInActiveMedicine, setTotalInActiveMedicine] = useState(0);
  const [loadingTotalInActiveMedicine, setLoadingTotalInActiveMedicine] =
    useState(false);
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [loadingTotalMedicines, setLoadingTotalMedicines] = useState(false);

  const [percentageMedicineCode, setPercentageMedicineCode] = useState({});
  const [loadingPercentageMedicineCode, setLoadingPercentageMedicineCode] =
    useState(false);

  const [survivalIndexStatistic, setSurvivalIndexStatistic] = useState({});
  const [loadingSurvivalIndexStatistic, setLoadingSurvivalIndexStatistic] =
    useState(false);

  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingTotalUsers, setLoadingTotalUsers] = useState(false);

  const [totalStudents, setTotalStudents] = useState(0);
  const [loadingTotalStudents, setLoadingTotalStudents] = useState(false);

  const [totalStaffs, setTotalStaffs] = useState(0);
  const [loadingTotalStaffs, setLoadingTotalStaffs] = useState(false);

  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loadingTotalDoctors, setLoadingTotalDoctors] = useState(false);

  const [statisticNumberUserByRole, setStatisticNumberUserByRole] = useState(
    {}
  );
  const [
    loadingStatisticNumberUserByRole,
    setLoadingStatisticNumberUserByRole,
  ] = useState(false);

  const [statisticPercentageUserByRole, setStatisticPercentageUserByRole] =
    useState({});
  const [
    loadingStatisticPercentageUserByRole,
    setLoadingStatisticPercentageUserByRole,
  ] = useState(false);

  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [loadingTotalFeedbacks, setLoadingTotalFeedbacks] = useState(false);

  const [totalSchedules, setTotalSchedules] = useState(0);
  const [loadingTotalSchedules, setLoadingTotalSchedules] = useState(false);

  const [totalSchedulesAccepted, setTotalSchedulesAccepted] = useState(0);
  const [loadingTotalSchedulesAccepted, setLoadingTotalSchedulesAccepted] =
    useState(false);

  const [
    loadingStatisticNumberScheduleByStatus,
    setLoadingStatisticNumberScheduleByStatus,
  ] = useState(false);

  const [statisticFeedbackOfDoctor, setStatisticFeedbackOfDoctor] = useState(
    {}
  );
  const [
    loadingStatisticFeedbackOfDoctor,
    setLoadingStatisticFeedbackOfDoctor,
  ] = useState(false);

  // For Medicine Statistics
  useEffect(() => {
    axios
      .get(`${medicineServiceAPI}/ExaminatedRecord/Statistic`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setExaminatedRecordStatistic({
          type: "bar",
          data: [
            {
              id: "examinatedRecordStatisticData",
              values: response.data.data,
            },
          ],
          title: {
            visible: true,
            text: "Statistics of medical records of doctors",
          },
          legends: {
            visible: true,
            orient: "left",
            title: {
              visible: true,
              text: "Elements",
            },
          },
          // label: {
          //   visible: true,
          // },
          xField: "doctorName",
          yField: "totalRecord",
        });
        setLoadingExaminatedRecordStatistic(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total active medicines
    axios
      .get(`${medicineServiceAPI}/Medicine/CountActiveMedicine`, {
        headers: headerConfig,
      })
      .then((response) => {
        // console.log(response.data);
        setTotalActiveMedicine(response.data.data);
        setLoadingTotalActiveMedicine(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total in-active medicines
    axios
      .get(`${medicineServiceAPI}/Medicine/CountInActiveMedicine`, {
        headers: headerConfig,
      })
      .then((response) => {
        // console.log(response.data.data);
        setTotalInActiveMedicine(response.data.data);
        setLoadingTotalInActiveMedicine(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total medicines
    axios
      .get(`${medicineServiceAPI}/Medicine`, {
        headers: headerConfig,
      })
      .then((response) => {
        // console.log(response);
        setTotalMedicines(response.data.totalDataList);
        setLoadingTotalMedicines(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For medicine statistic
    axios
      .get(`${medicineServiceAPI}/Medicine/Statistic`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        let processData = response.data.data;
        const modifiedData = processData.map((item) => ({
          codeName: item.codeName,
          average: item.average * 100,
        }));

        setPercentageMedicineCode({
          type: "pie",
          data: [
            {
              id: "percentageMedicineCodeStatistic",
              values: modifiedData,
            },
          ],
          outerRadius: 0.8,
          valueField: "average",
          categoryField: "codeName",
          title: {
            visible: true,
            text: "List drug groups by quantity statistics",
          },
          legends: {
            visible: true,
            orient: "left",
          },
          // label: {
          //   visible: true,
          // },
          tooltip: {
            mark: {
              content: [
                {
                  key: (datum) => datum["codeName"],
                  value: (datum) => datum["average"] + "%",
                },
              ],
            },
          },
        });
        setLoadingPercentageMedicineCode(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For medical rate statistic
    axios
      .get(`${medicineServiceAPI}/ExaminatedRecord/SurvivalRate`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setSurvivalIndexStatistic({
          type: "bar",
          data: [
            {
              id: "survivalIndexStatistic",
              values: response.data.data,
            },
          ],
          title: {
            visible: true,
            text: "List survival index statistics",
          },
          legends: {
            visible: true,
            orient: "left",
            title: {
              visible: true,
              text: "Measurement data from specialized equipment",
            },
          },
          // label: {
          //   visible: true,
          // },
          xField: "rateName",
          yField: "rateAverage",
        });
        setLoadingSurvivalIndexStatistic(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }, []);

  // For user statisics
  useEffect(() => {
    // For fetch total users
    axios
      .get(`${userServiceAPI}/Authentication/Users`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalUsers(response.data.totalDataList);
        setLoadingTotalUsers(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total student
    axios
      .get(`${userServiceAPI}/Authentication/Students`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalStudents(response.data.totalDataList);
        setLoadingTotalStudents(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total staffs
    axios
      .get(`${userServiceAPI}/Authentication/Staffs`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalStaffs(response.data.totalDataList);
        setLoadingTotalStaffs(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total doctors
    axios
      .get(`${userServiceAPI}/Authentication/Doctors`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalDoctors(response.data.totalDataList);
        setLoadingTotalDoctors(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch statistic user by roles
    axios
      .get(`${userServiceAPI}/Authentication/StatisticRole`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        let barChart = {
          type: "bar",
          data: [
            {
              id: "numberUserbyRoles",
              values: response.data.data,
            },
          ],
          title: {
            visible: true,
            text: "Statistics of number user by roles",
          },
          legends: {
            visible: true,
            orient: "left",
            title: {
              visible: true,
              text: "Number of users",
            },
          },
          // label: {
          //   visible: true,
          // },
          xField: "roleName",
          yField: "numberOfUser",
        };

        let processData = response.data.data;
        const modifiedData = processData.map((item) => ({
          roleName: item.roleName,
          percentage: item.percentage * 100,
        }));

        let pieChart = {
          type: "pie",
          data: [
            {
              id: "percentageUserbyRoles",
              values: modifiedData,
            },
          ],
          outerRadius: 0.8,
          valueField: "percentage",
          categoryField: "roleName",
          title: {
            visible: true,
            text: "List users by roles statistics",
          },
          legends: {
            visible: true,
            orient: "left",
          },
          // label: {
          //   visible: true,
          // },
          tooltip: {
            mark: {
              content: [
                {
                  key: (datum) => datum["roleName"],
                  value: (datum) => datum["percentage"] + "%",
                },
              ],
            },
          },
        };
        setStatisticNumberUserByRole(barChart);
        setLoadingStatisticNumberUserByRole(true);

        setStatisticPercentageUserByRole(pieChart);
        setLoadingStatisticPercentageUserByRole(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }, []);

  // For Feedbacks statistic
  useEffect(() => {
    // For fetch all feedback
    axios
      .get(`${userServiceAPI}/Feedback`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalFeedbacks(response.data.totalDataList);
        setLoadingTotalFeedbacks(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    axios
      .get(`${userServiceAPI}/Feedback/StatisticFeedbackOfDoctor`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setStatisticFeedbackOfDoctor({
          type: "bar",
          data: [
            {
              id: "statisticFeedbackOfDoctor",
              values: response.data.data,
            },
          ],
          title: {
            visible: true,
            text: "List feedback of Doctor statistics",
          },
          xField: "doctorName",
          yField: ["avg"],
        });
        setLoadingStatisticFeedbackOfDoctor(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }, []);

  // For Schedules statistic
  useEffect(() => {
    // For fetch all Schedules
    axios
      .get(`${scheduleServiceAPI}/Schedule`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setSchedule(response.data.data);
        setTotalSchedules(response.data.totalDataList);
        setLoadingTotalSchedules(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch all Schedules Accepted
    axios
      .get(`${scheduleServiceAPI}/Schedule/GetAcceptSchedule`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalSchedulesAccepted(response.data.totalDataList);
        setLoadingTotalSchedulesAccepted(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
    setLoadingStatisticNumberScheduleByStatus(true);
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
      <div className="flex flex-col items-center p-5 gap-4 w-fit">
        <div className="bg-gray-100 w-5/6 text-center h-fit p-[18px] font-bold rounded-lg">
          <span className="text-2xl text-bg-neutral-4">
            School Health Counseling{" "}
          </span>
          <span className="text-2xl text-content-neutral-5">
            Scheduling System
          </span>
          <p>
            <span className="text-2xl text-bg-neutral-4">Admin Overview </span>
            <span className="text-2xl text-content-neutral-5">Page</span>
          </p>
        </div>
        <div className="flex w-full gap-4 justify-center items-center">
          {/* <div className="w-4/12 h-full min-h-[18rem] text-sm border-white border-2 rounded-lg p-4 font-bold text-justify bg-slate-50 text-gray-800">
            <h1 className="mb-4 text-2xl px-10 font-extrabold text-gray-900 dark:text-white text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                Welcome
              </span>
            </h1>
            Our website revolutionizes school health management through an
            advanced online medical room management application. Tailored to
            meet the growing demands of modern educational institutions, our
            platform simplifies visitor information management, medication
            tracking, and student health monitoring. With features including
            appointment scheduling and real-time communication channels, we
            empower medical staff to deliver proactive and efficient care.
            Explore our website to witness the transformation of school health
            management with convenience, efficiency, and innovation.
          </div> */}
          <div className="w-12/12 h-full min-h-[18rem] p-4 rounded-lg bg-slate-50 border-white border-2">
            <h1 className="mb-4 text-2xl px-10 font-extrabold text-gray-900 dark:text-white text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                Admin
              </span>{" "}
              Dashboard
            </h1>
            <div className="flex flex-wrap justify-start items-start gap-4">
              <Tooltip content={"Go to User management page"}>
                <Link href="/admin/user/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaUserGroup className="mr-2" />
                    User
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Doctor management page"}>
                <Link href="/admin/doctor/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaUserDoctor className="mr-2" />
                    Doctor
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Staff management page"}>
                <Link href="/admin/staff/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaUserNurse className="mr-2" />
                    Staff
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Student management page"}>
                <Link href="/admin/student/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaUsers className="mr-2" />
                    Student
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Role management page"}>
                <Link href="/admin/role/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaUserCog className="mr-2" />
                    Role
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Unit management page"}>
                <Link href="/admin/unit/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaPills className="mr-2" />
                    Unit
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Medicine management page"}>
                <Link href="/admin/medicine/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaBriefcaseMedical className="mr-2" />
                    Medicine
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to examined Record management page"}>
                <Link href="/admin/examinatedRecord/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaBook className="mr-2" />
                    Examined Record
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Medical Examinated management page"}>
                <Link href="/admin/medicalExaminatedRecord/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaBookMedical className="mr-2" />
                    Medical Examinated
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Medicine code management page"}>
                <Link href="/admin/medicineCode/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaPills className="mr-2" />
                    Medicine Code
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Feedback management page"}>
                <Link href="/admin/feedback/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaCommentAlt className="mr-2" />
                    Feedback
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Blog management page"}>
                <Link href="/admin/blog/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaPager className="mr-2" />
                    Blog
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Schedule management page"}>
                <Link href="/admin/schedule/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaCalendarAlt className="mr-2" />
                    Schedule
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to chat management page"}>
                <Link href="/admin/chat/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaRegMessage className="mr-2" />
                    Chat
                  </button>
                </Link>
              </Tooltip>
              <Tooltip content={"Go to Patient management page"}>
                <Link href="/admin/patient/list">
                  <button
                    className="flex items-center justify-center min-w-[11rem] text-sm h-12 bg-[#0096c7] text-white rounded-lg font-bold transition duration-300 hover:bg-[#48cae4] hover:text-white"
                    onClick={handleClick}
                  >
                    <FaUsers className="mr-2" />
                    Patient
                  </button>
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex w-full gap-4 justify-start items-start">
          <div className="w-4/12 text-sm border-white border-2 rounded-lg p-4 font-bold text-justify bg-slate-50 text-gray-800">
            <h1 className="mb-4 text-2xl px-10 font-extrabold text-gray-900 dark:text-white text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                View Statistics
              </span>
            </h1>

            <div className="flex flex-col gap-4 justify-center items-center">
              {loadingTotalUsers ? (
                <div className="text-center h-40 w-full rounded-xl shadow-md p-6 bg-blue-400">
                  <div className="font-semibold mb-1 text-lg">Total Users</div>
                  <div className="font-semibold text-5xl tracking-tight">
                    {totalUsers}
                  </div>
                  <div className="font-normal">Users</div>
                </div>
              ) : (
                <div className="h-40 rounded-xl shadow-md p-6 bg-blue-400 flex justify-center items-center">
                  <Spin aria-label="Spinner button example" />
                </div>
              )}

              {loadingTotalStudents ? (
                <div className="text-center h-40 w-full rounded-xl shadow-md p-6 bg-red-400">
                  <div className="font-semibold mb-1 text-lg">
                    Total Students
                  </div>
                  <div className="font-semibold text-5xl tracking-tight">
                    {totalStudents}
                  </div>
                  <div className="font-normal">Students</div>
                </div>
              ) : (
                <div className="h-40 rounded-xl shadow-md p-6 bg-red-400 flex justify-center items-center">
                  <Spin aria-label="Spinner button example" />
                </div>
              )}

              {loadingTotalStaffs ? (
                <div className="text-center h-40 w-full rounded-xl shadow-md p-6 bg-green-400">
                  <div className="font-semibold mb-1 text-lg">Total Staffs</div>
                  <div className="font-semibold text-5xl tracking-tight">
                    {totalStaffs}
                  </div>
                  <div className="font-normal">Staffs</div>
                </div>
              ) : (
                <div className="h-40 rounded-xl shadow-md p-6 bg-green-400 flex justify-center items-center">
                  <Spin aria-label="Spinner button example" />
                </div>
              )}

              {loadingTotalDoctors ? (
                <div className="text-center h-40 w-full rounded-xl shadow-md p-6 bg-purple-400">
                  <div className="font-semibold mb-1 text-lg">
                    Total Doctors
                  </div>
                  <div className="font-semibold text-5xl tracking-tight">
                    {totalDoctors}
                  </div>
                  <div className="font-normal">Doctors</div>
                </div>
              ) : (
                <div className="h-40 rounded-xl shadow-md p-6 bg-purple-400 flex justify-center items-center">
                  <Spin aria-label="Spinner button example" />
                </div>
              )}
            </div>
          </div>

          <div className="w-8/12 h-fit  p-4 rounded-lg bg-slate-50 border-white border-2">
            <div className="flex flex-col h-full w-full justify-items-center items-center">
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
                  width={800}
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
        </div>
      </div>
    </SemiLocaleProvider>
  );
}
