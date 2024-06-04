"use client";
import {
  Calendar,
  DatePicker,
  Radio,
  RadioGroup,
  Table,
  Tooltip,
} from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { formatDate } from "@/libs/common";
import { useParams } from "next/navigation";
import {
  headerConfig,
  scheduleServiceAPI,
  userServiceAPI,
} from "@/libs/highmedicineapi";
import { Dropdown, Tag, Modal, Button } from "@douyinfe/semi-ui";
import Link from "next/link";
import { IconMore } from "@douyinfe/semi-icons";
import ScheduleListPage from "../../../schedule/listCalendar/page";

const WaitingScheduleDoctorListPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [mode, setMode] = useState("week");
  const [displayValue, setDisplayValue] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const pageSize = 10;
  const doctorId = useParams().id;
  const handleConfirmApproval = () => {
    setLoading(true);
  };
  const getData = () => {
    return axios
      .get(
        `${scheduleServiceAPI}/Schedule/getWattingConfirmSchedule/doctorId?id=${doctorId}`,
        {
          headers: headerConfig,
        }
      )
      .then((response) => {
        setTotal(response.data.totalDataList);
        if (JSON.stringify(response.data.data) == "[]") {
          setIsEmptyData(true);
        }
        return response.data.data;
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };
  const fetchData = (currentPage = 1) => {
    setLoading(true);
    setPage(currentPage);

    let dataUnits;
    getData()
      .then((result) => {
        console.log(result);
        dataUnits = result;
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });

    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = dataUnits;
        let filteredData = data?.filter((unit) => unit.isActive);
        let dataSource = filteredData?.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );
        res(dataSource);
      }, 300);
    }).then((dataSource) => {
      setLoading(false);
      setData(dataSource);
    });
  };

  const handlePageChange = (page) => {
    fetchData(page);
  };

  useEffect(() => {
    fetchData();

    axios
      .get(
        `${scheduleServiceAPI}/Schedule/getWattingConfirmSchedule/doctorId?id=${doctorId}`,
        {
          headers: headerConfig,
        }
      )
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
                style={{ fontSize: "smaller", marginBottom: "5px", padding: 4 }}
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

  const columns = [
    {
      title: "Schedule ID",
      dataIndex: "scheduleId",
      sorter: (a, b) => a.scheduleId - b.scheduleId,
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorName",
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => formatDate(date),
    },
    {
      title: "Start Shift",
      dataIndex: "startShift",
    },
    {
      title: "End Shift",
      dataIndex: "endShift",
    },
    {
      title: "IsAccepted",
      dataIndex: "isAccepted",
      render: (isAccepted) => (isAccepted ? "True" : "False"),
    },
    {
      title: "Action",
      dataIndex: "operate",
      render: (text, record) => {
        return (
          <Dropdown
            position={"bottomRight"}
            render={
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link
                    href={`/client/confirmSchedule/approval/doctor/${record.scheduleId}`}
                  >
                    <div
                      style={{
                        width: "100px",
                        borderRadius: "5px",
                        overflow: "hidden",
                        background:
                          "linear-gradient(to right, #4CAF50 54%, #FF5733 46%)",
                        transition: "all 0.3s ease-out",
                      }}
                    >
                      <Button
                        onClick={handleConfirmApproval}
                        style={{
                          color: "#ffffff",
                          backgroundColor: "#1890ff",
                          borderColor: "#1890ff",
                          width: "100px",
                        }}
                      >
                        Detail
                      </Button>
                    </div>
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            }
          >
            <IconMore />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <SemiLocaleProvider locale={en_US}>
      <div className="flex flex-col items-start w-full p-8 mt-5">
        <HeaderAdminManagementComponent
          content={"Waiting Schedule List for Doctor"}
        />
        {isEmptyData ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center">
              <div className="font-bold mb-4">
                No waiting schedules available to display
              </div>
            </div>
          </div>
        ) : (
          <SemiLocaleProvider locale={en_US}>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{
                current: currentPage,
                pageSize,
                total,
                onChange: handlePageChange,
              }}
              loading={loading}
              style={{ paddingTop: "1.25rem" }}
            />
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
          </SemiLocaleProvider>
        )}
      </div>
    </SemiLocaleProvider>
  );
};

export default WaitingScheduleDoctorListPage;
