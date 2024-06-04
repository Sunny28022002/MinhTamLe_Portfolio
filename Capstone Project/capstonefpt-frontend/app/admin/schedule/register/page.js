"use client";
import { IconMore } from "@douyinfe/semi-icons";
import {
  Calendar,
  DatePicker,
  Radio,
  RadioGroup,
  Table,
  Tag,
  Tooltip,
} from "@douyinfe/semi-ui";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Modal, Button } from "@douyinfe/semi-ui";
import {
  headerConfig,
  userServiceAPI,
  scheduleServiceAPI,
  adminRole,
} from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { formatDate } from "@/libs/common";
import { Toast, AutoComplete } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { withAuth } from "@/contexts/withAuth";
import { Avatar } from "@douyinfe/semi-ui/lib/es/skeleton/item";
import ScheduleListPageRe from "@/app/client/schedule/listCalendar/page";

const ScheduleListPage = () => {
  const [dataSource, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scheduleRegister, setScheduleRegister] = useState({});
  let [patients, setPatients] = useState(null);
  const [patientOptions, setPatientOptions] = useState([]);
  const pageSize = 10;
  const [mode, setMode] = useState("week");
  const [displayValue, setDisplayValue] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [doctors, setDoctors] = useState([]);

  let toast = {
    content: "",
    duration: 3,
  };

  //handle modal state
  const showDialog = (scheduleId) => {
    setVisible(true);
    setScheduleRegister({
      scheduleId: scheduleId,
      patientId: "",
    });
  };

  const handleRegister = (patientId) => {
    setScheduleRegister({
      ...scheduleRegister,
      patientId: patientId,
    });
  };

  const handleOk = () => {
    //console.log(JSON.stringify(scheduleRegister))
    setLoading(true);
    axios
      .put(`${scheduleServiceAPI}/Schedule/Register`, scheduleRegister, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        toast.content = response.data.message;
        Toast.success(toast);
        setScheduleRegister({});
        getData();
        fetchData();
        setLoading(false);
        setVisible(false);
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
  useEffect(() => {
    axios
      .get(`${scheduleServiceAPI}/Schedule/GetEmptySchedule`, {
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

  const getData = () => {
    return axios
      .get(`${scheduleServiceAPI}/Schedule`, {
        headers: headerConfig,
      })
      .then((response) => {
        setTotal(response.data.totalDataList);
        if (JSON.stringify(response.data.data) == "[]") {
          setIsEmptyData(true);
        }
        console.log(response.data.data);
        return response.data.data;
      })
      .catch((error) => {
        // Handle error.
        console.log("An error occurred:", error.response);
      });
  };

  const fetchData = (currentPage = 1) => {
    setLoading(true);
    setPage(currentPage);

    //handle get data staffs
    let dataStaffs;
    getData()
      .then((result) => {
        // console.log(result); // Handle the data here
        dataStaffs = result; // Assign the result to a variable dataDoctors
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = dataStaffs;
        let dataSource = data?.slice(
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
    axios
      .get(`${userServiceAPI}/Authentication`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setUser(response.data.data);
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

    getData();
    fetchData();
  }, []);

  const searchPatientOptions = (value) => {
    let result;
    if (value) {
      result = patients.map((item) => {
        return { ...item, value: item.userId, label: item.username };
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
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.username}</div>
        </div>
      </>
    );
  };
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

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "doctorId",
      sorter: (a, b) => (a.doctorId - b.doctorId > 0 ? 1 : -1),
      render: (doctorId) => getValueByIndex(user, doctorId),
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => (a.date - b.date > 0 ? 1 : -1),
      render: (text) => formatDate(text),
    },
    {
      title: "Start Shift",
      dataIndex: "startShift",
      sorter: (a, b) => (a.startShift - b.startShift > 0 ? 1 : -1),
    },
    {
      title: "End Shift",
      dataIndex: "endShift",
      sorter: (a, b) => (a.endShift - b.endShift > 0 ? 1 : -1),
    },
    {
      title: "Status",
      dataIndex: "patientId",
    },
    {
      title: "Action",
      dataIndex: "operate",
      render: (text, record) => {
        return (
          <>
            <Button
              style={{
                color: "#ffffff",
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
                width: "100px",
              }}
              onClick={() => showDialog(record.scheduleId)}
            >
              Register
            </Button>
            <Modal
              title="Register Confirm"
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
              centered
              bodyStyle={{ overflow: "auto", height: 200 }}
              cancelText="Cancel"
              okText="Confirm"
            >
              <p style={{ lineHeight: 1.8 }}>
                Choose patient to register this schedule?
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
                  height: "42px",
                  fontWeight: "600",
                  marginTop: "-2px",
                }}
                className=""
                renderSelectedItem={(option) => option.username}
                renderItem={renderPatientOption}
                onSearch={searchPatientOptions}
                onSelect={(v) => handleRegister(v)}
              ></AutoComplete>
            </Modal>
          </>
        );
      },
    },
  ];
  const rowSelection = {
    getCheckboxProps: (record) => ({
      //disabled: record.Role === "Administrator", // Column configuration not to be checked
      name: record.UserName,
    }),
    onSelect: (record, selected) => {
      console.log(`select row: ${selected}`, record);
    },
    onSelectAll: (selected, selectedRows) => {
      console.log(`select all rows: ${selected}`, selectedRows);
    },
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  return (
    <SemiLocaleProvider locale={en_US}>
      <div className="flex flex-col items-center w-5/6 p-8">
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
          <>
            <Table
              columns={columns}
              dataSource={dataSource}
              rowSelection={rowSelection}
              pagination={{
                currentPage,
                pageSize: 10,
                total: total,
                onPageChange: handlePageChange,
              }}
              loading={loading}
              style={{
                marginTop: 12,
              }}
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
          </>
        )}
      </div>
    </SemiLocaleProvider>
  );
};

export default withAuth(ScheduleListPage, adminRole);
