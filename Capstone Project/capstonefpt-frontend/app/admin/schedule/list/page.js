"use client";
import { IconMore } from "@douyinfe/semi-icons";
import {
  Avatar,
  Calendar,
  DatePicker,
  Radio,
  RadioGroup,
  SideSheet,
  Table,
} from "@douyinfe/semi-ui";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Dropdown, Tag, Modal, Button } from "@douyinfe/semi-ui";
import {
  headerConfig,
  userServiceAPI,
  scheduleServiceAPI,
  adminRole,
} from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Link from "next/link";
import { formatDate, formatDateScheduleSearch } from "@/libs/common";
import { Toast, Spin } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";
import { Tooltip } from "@douyinfe/semi-ui";
import { VChart } from "@visactor/react-vchart";

const ScheduleListAdminPage = () => {
  const [dataSource, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scheduleIdDelete, setScheduleIdDelete] = useState(0);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState([]);
  const [mode, setMode] = useState("week");
  const [displayValue, setDisplayValue] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [totalSchedules, setTotalSchedules] = useState(0);
  const [loadingTotalSchedules, setLoadingTotalSchedules] = useState(false);
  const [totalSchedulesAccepted, setTotalSchedulesAccepted] = useState(0);
  const [loadingTotalSchedulesAccepted, setLoadingTotalSchedulesAccepted] =
    useState(false);

  const [
    loadingStatisticNumberScheduleByStatus,
    setLoadingStatisticNumberScheduleByStatus,
  ] = useState(false);

  let toast = {
    content: "",
    duration: 3,
  };

  const [visibleCalendarModal, setVisibleCalendarModal] = useState(false);
  const onCloseCalendarModal = () => {
    setVisibleCalendarModal(false);
  };

  const handleSearch = () => {
    setLoading(true);

    console.log(searchQuery);
    let dateStart = formatDate(searchQuery[0]);
    let dateEnd = formatDate(searchQuery[1]);

    if (searchQuery.length !== 0) {
      axios
        .get(
          `${scheduleServiceAPI}/Schedule/Search?dateStart=${dateStart}&dateEnd=${dateEnd}`,
          {
            headers: headerConfig,
          }
        )
        .then((response) => {
          console.log(response.data.data);
          setTotal(response.data.totalDataList);
          setData(response.data.data);
        })
        .catch((error) => {
          console.log("An error occurred:", error.response);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      fetchData();
    }
  };
  const handleUpdate = () => {
    setLoading(true);
  };

  const handleConfirmApproval = () => {
    setLoading(true);
  };

  const showDialog = (scheduleId) => {
    console.log(scheduleId);
    setVisible(true);
    setScheduleIdDelete(scheduleId);
  };
  const handleOk = () => {
    setLoading(true);
    axios
      .put(
        `${scheduleServiceAPI}/Schedule/Delete?id=${scheduleIdDelete}`,
        null,
        {
          headers: headerConfig,
        }
      )
      .then((response) => {
        toast.content = response.data.message;
        Toast.success(toast);
        setScheduleIdDelete(0);
        getData();
        fetchData();
        setVisible(false);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          toast.content = "Can't delete this schedule";
        } else if (error.response && error.response.data) {
          toast.content = error.response.data;
        } else {
          toast.content = "An unknown error occurred";
        }
        Toast.error(toast);
        setLoading(false);
      });
  };
  const handleCancel = () => {
    setScheduleIdDelete(0);
    setVisible(false);
  };

  const getValueByIndex = (arr, targetIndex) => {
    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
      return targetObject.username;
    } else {
      return <span style={{ color: "red" }}>Empty</span>;
    }
  };

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
        console.log("An error occurred:", error.response);
      });
  };

  const fetchData = (currentPage = 1) => {
    setLoading(true);
    setPage(currentPage);
    let dataStaffs;
    getData()
      .then((result) => {
        dataStaffs = result;
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

    getData();
    fetchData();
  }, []);
  useEffect(() => {
    axios
      .get(`${scheduleServiceAPI}/Schedule`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log("Schedule", response.data.data);
        setSchedule(response.data.data);
        setTotalSchedules(response.data.totalDataList);
        setLoadingTotalSchedules(true);
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
      .get(`${userServiceAPI}/Authentication`, {
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

  const columns = [
    {
      title: "ScheduleId",
      dataIndex: "scheduleId",
      sorter: (a, b) => (a.scheduleId - b.scheduleId > 0 ? 1 : -1),
    },
    {
      title: "Doctor name",
      dataIndex: "doctorName",
      sorter: (a, b) => (a.doctorId - b.doctorId > 0 ? 1 : -1),
      // render: (doctorId) => getValueByIndex(user, doctorId),
    },
    {
      title: "Patient name",
      dataIndex: "patientName",
      sorter: (a, b) => (a.patientId - b.patientId > 0 ? 1 : -1),
      // render: (patientId) => getValueByIndex(user, patientId),
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
      title: "Is Accepted",
      dataIndex: "isAccepted",
      render: (isAccepted) => (isAccepted ? "True" : "False"),
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      render: (isActive) => (isActive ? "True" : "False"),
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
                  <Link href={`/admin/schedule/update/${record.scheduleId}`}>
                    <Button
                      onClick={handleUpdate}
                      style={{
                        color: "#ffffff",
                        backgroundColor: "#1890ff",
                        borderColor: "#1890ff",
                        width: "6.25rem",
                      }}
                    >
                      Update
                    </Button>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link
                    href={`/admin/confirmSchedule/approval/${record.scheduleId}`}
                  >
                    <div
                      style={{
                        color: "#ffffff",
                        backgroundColor: "#1890ff",
                        borderColor: "#1890ff",
                        width: "100px",
                      }}
                    >
                      <Button
                        onClick={handleConfirmApproval}
                        style={{
                          color: "#ffffff",
                          borderColor: "transparent",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        Detail
                      </Button>
                    </div>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Button
                    onClick={() => showDialog(record.scheduleId)}
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#ff4d4f",
                      borderColor: "#ff4d4f",
                      width: "100px",
                    }}
                  >
                    Delete
                  </Button>
                  <Modal
                    title="Delete Confirm"
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    centered
                    bodyStyle={{ overflow: "auto", height: 100 }}
                    cancelText="Cancel"
                    okText="Confirm"
                  >
                    <p style={{ lineHeight: 1.8 }}>
                      Are you sure you want to delete this data?
                    </p>
                  </Modal>
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
  const rowSelection = {
    getCheckboxProps: (record) => ({
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
      <div className="flex flex-col items-start w-full p-8 mt-5">
        {/* -------- Title -------- */}
        <HeaderAdminManagementComponent content={"Schedule Management"} />
        <div className="flex items-center mt-4">
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
              Statistic
            </span>
          </h1>
        </div>

        <div className="flex gap-4 w-full bg-slate-200 rounded-2xl p-4 mb-6">
          <div className="flex flex-col gap-4 justify-center items-center w-3/4">
            {loadingStatisticNumberScheduleByStatus ? (
              <VChart
                spec={{
                  height: 400,
                  width: 900,
                  type: "bar",
                  data: [
                    {
                      id: "numberSchedulebyStatus",
                      values: [
                        { status: "All", numberOfSchedule: totalSchedules },
                        {
                          status: "Accepted",
                          numberOfSchedule: totalSchedulesAccepted,
                        },
                      ],
                    },
                  ],
                  title: {
                    visible: true,
                    text: "Statistics of schdule by status",
                  },
                  legends: {
                    visible: true,
                    orient: "top",
                    title: {
                      visible: true,
                      text: "Number of Schedule",
                    },
                  },
                  // label: {
                  //   visible: true,
                  // },
                  xField: "status",
                  yField: "numberOfSchedule",
                }}
                option={{
                  mode: "desktop-browser",
                }}
              />
            ) : (
              <div className="">
                <Spin aria-label="Spinner button example" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 justify-center items-center w-6/12">
            <div className="flex flex-col gap-4">
              {loadingTotalSchedules ? (
                <div className="h-40 rounded-xl shadow-md p-6 bg-bg-neutral-4 min-w-[17rem]">
                  <div className="font-semibold mb-1 text-lg text-white">
                    Total Schedule
                  </div>
                  <div className="font-semibold text-5xl tracking-tight text-white">
                    {totalSchedules}
                  </div>
                  <div className="font-normal text-white">Schedules</div>
                </div>
              ) : (
                <div className="h-40 rounded-xl shadow-md p-6 bg-bg-neutral-4 flex justify-center items-center">
                  <Spin aria-label="Spinner button example" />
                </div>
              )}

              {loadingTotalSchedulesAccepted ? (
                <div className="h-40 rounded-xl shadow-md p-6 bg-white min-w-[17rem]">
                  <div className="font-semibold mb-1 text-lg">
                    Total Accepted Schedule
                  </div>
                  <div className="font-semibold text-5xl tracking-tight">
                    {totalSchedulesAccepted}
                  </div>
                  <div className="font-normal">Accepted Schedules</div>
                </div>
              ) : (
                <div className="h-40 rounded-xl shadow-md p-6 bg-bg-neutral-4 flex justify-center items-center">
                  <Spin aria-label="Spinner button example" />
                </div>
              )}
            </div>
          </div>
        </div>
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
            <div className="flex justify-between gap-4 w-full">
              <div className="flex items-center">
                <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-600 from-red-400">
                    Management
                  </span>
                </h1>
                <Button
                  onClick={() => setVisibleCalendarModal(true)}
                  style={{
                    height: "75%",
                    borderRadius: "8px ",
                    marginLeft: "30px",
                    marginBottom: "13px",
                    backgroundColor: "#4361EE",
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    transition: "all 0.3s",
                  }}
                >
                  Open Schedule Calendar
                </Button>
              </div>
              <div className="flex items-start justify-start mt-2">
                <DatePicker
                  type="dateRange"
                  density="compact"
                  style={{ width: 260, height: "75%" }}
                  onChange={(value) => {
                    console.log(value);
                    setSearchQuery(value);
                  }}
                />
                <Button
                  onClick={handleSearch}
                  style={{
                    height: "75%",
                    borderRadius: "0",
                    marginLeft: "-1px",
                    backgroundColor: "#4361EE",
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    transition: "all 0.3s",
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "8px",
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
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
            />

            <SideSheet
              visible={visibleCalendarModal}
              onCancel={onCloseCalendarModal}
              placement={"bottom"}
              size={"large"}
            >
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
            </SideSheet>
          </>
        )}
      </div>
    </SemiLocaleProvider>
  );
};

export default withAuth(ScheduleListAdminPage, adminRole);
