"use client";
import { IconMore } from "@douyinfe/semi-icons";
import { Table, Spin } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown, Modal, Button, Select } from "@douyinfe/semi-ui";
import {
  headerConfig,
  userServiceAPI,
  medicineServiceAPI,
  adminRole,
} from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Link from "next/link";
import { Toast } from "@douyinfe/semi-ui";
import { formatDate } from "@/libs/common";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { getUniqueRecords } from "@/libs/common";
import { withAuth } from "@/contexts/withAuth";
import { VChart } from "@visactor/react-vchart";

const FeedbackPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [FeedbackIdDelete, setFeedbackIdDelete] = useState(0);
  const [PatientIdDelete, setPatientIdDelete] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorName, setDoctorName] = useState();
  const pageSize = 10;

  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [loadingTotalFeedbacks, setLoadingTotalFeedbacks] = useState(false);

  const [statisticFeedbackOfDoctor, setStatisticFeedbackOfDoctor] = useState(
    {}
  );
  const [
    loadingStatisticFeedbackOfDoctor,
    setLoadingStatisticFeedbackOfDoctor,
  ] = useState(false);

  let toast = {
    content: "",
    duration: 3,
  };

  const handleFilterDoctor = (userId) => {
    setLoading(true);
    if (userId !== null && userId !== 0) {
      axios
        .get(`${userServiceAPI}/Feedback/doctor/id?id=${userId}`, {
          headers: headerConfig,
        })
        .then((response) => {
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

  const showDialog = (feedbackId, patientId) => {
    console.log(feedbackId);
    console.log(patientId);
    setVisible(true);
    setFeedbackIdDelete(feedbackId);
    setPatientIdDelete(patientId);
  };
  const requestBody = {
    feedbackId: FeedbackIdDelete,
    patientId: PatientIdDelete,
  };

  const handleOk = () => {
    setLoading(true);
    axios
      .put(`${userServiceAPI}/Feedback/Delete`, requestBody, {
        headers: headerConfig,
      })
      .then((response) => {
        toast.content = response.data.message;
        Toast.success(toast);
        setFeedbackIdDelete(0);
        setPatientIdDelete(0);
        getData();
        fetchData();
        setVisible(false);
        setLoading(false);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        toast.content = error.response.data.message;
        Toast.error(toast);
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setFeedbackIdDelete(0);
    setVisible(false);
  };

  const getData = () => {
    return axios
      .get(`${userServiceAPI}/Feedback`, {
        headers: headerConfig,
      })
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
  const getValueByIndex = (arr, targetIndex) => {
    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
      return targetObject.username;
    } else {
      return null;
    }
  };

  useEffect(() => {
    getData();
    fetchData();
    //fetch doctors
    axios
      .get(`${userServiceAPI}/Authentication/Doctors`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setDoctors(response.data.data);
        const listDoctorName = response.data.data.map((item) => ({
          value: item.userId,
          label: item.username,
        }));
        listDoctorName.push({ value: 0, label: "All" });
        setDoctorName(listDoctorName);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});

    //fetch patients
    axios
      .get(`${userServiceAPI}/Authentication`, {
        headers: headerConfig,
      })
      .then((response) => {
        const dataArr = response.data.data;
        const uniqueRecords = getUniqueRecords(dataArr, "userId");
        console.log(uniqueRecords);
        setPatients(uniqueRecords);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});

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

  const columns = [
    {
      title: "Feedback ID",
      dataIndex: "feedbackId",
      sorter: (a, b) => (a.feedbackId - b.feedbackId > 0 ? 1 : -1),
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorId",
      render: (doctorId) => getValueByIndex(doctors, doctorId),
    },
    {
      title: "Patient Name",
      dataIndex: "patientId",
      render: (patientId) => getValueByIndex(patients, patientId),
    },
    {
      title: "Feedback Date",
      dataIndex: "feedbackDate",
      sorter: (a, b) => (a.feedbackDate - b.feedbackDate > 0 ? 1 : -1),
      render: (text) => formatDate(text),
    },
    {
      title: "Message",
      dataIndex: "message",
      sorter: (a, b) => a.message.localeCompare(b.message),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => (a.rating - b.rating > 0 ? 1 : -1),
    },
    {
      title: "Active",
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
                  <Link href={`/admin/feedback/update/${record.feedbackId}`}>
                    <Button
                      style={{
                        color: "#ffffff",
                        backgroundColor: "#1890ff",
                        borderColor: "#1890ff",
                        width: "6.25rem",
                      }}
                      onClick={handleUpdate}
                    >
                      Update
                    </Button>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Button
                    onClick={() =>
                      showDialog(record.feedbackId, record.patientId)
                    }
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#ff4d4f",
                      borderColor: "#ff4d4f",
                      width: "6.25rem",
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
      disabled: record.Role === "Administrator",
      name: record.Role,
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
    <div className="flex flex-col w-full p-8 mt-5">
      <HeaderAdminManagementComponent content={"Feedback Management"} />
      <div className="flex items-center mt-4">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
            Statistic
          </span>
        </h1>
      </div>

      <div className="flex gap-4 w-full bg-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          {loadingStatisticFeedbackOfDoctor ? (
            <VChart
              spec={{
                height: 400,
                ...statisticFeedbackOfDoctor,
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

        <div className="flex flex-col gap-4 justify-center items-center w-2/5">
          <div className="flex gap-4">
            {loadingTotalFeedbacks ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-white min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">Total Feedback</div>
                <div className="font-semibold text-5xl tracking-tight">
                  {totalFeedbacks}
                </div>
                <div className="font-normal">Feedbacks</div>
              </div>
            ) : (
              <div className="h-40 rounded-xl shadow-md p-6 bg-white flex justify-center items-center">
                <Spin aria-label="Spinner button example" />
              </div>
            )}
          </div>
        </div>
      </div>
      {isEmptyData ? (
        <>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="font-bold mb-4">
                No information available to display
              </div>
              <Link href={"/admin/feedback/create"}>
                <Button>Go to Create Feedback Page</Button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <SemiLocaleProvider locale={en_US}>
            <div className="flex justify-between gap-4 w-full">
              <div className="flex items-center">
                <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-600 from-red-400">
                    Management
                  </span>{" "}
                </h1>
              </div>
              <div className="flex items-start justify-start mt-2">
                <Select
                  className=""
                  style={{ width: 320 }}
                  optionList={doctorName}
                  insetLabel="Filter by Doctor Name"
                  onChange={handleFilterDoctor}
                  defaultValue={"All"}
                ></Select>
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
              style={{ paddingTop: "1.25rem" }}
            />
          </SemiLocaleProvider>
        </>
      )}
    </div>
  );
};

export default withAuth(FeedbackPage, adminRole);
