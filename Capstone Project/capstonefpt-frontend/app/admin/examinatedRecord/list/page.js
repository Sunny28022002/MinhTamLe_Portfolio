"use client";
import { IconMore } from "@douyinfe/semi-icons";
import { Table } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown, Modal, Button } from "@douyinfe/semi-ui";
import {
  headerConfig,
  userServiceAPI,
  medicineServiceAPI,
  adminRole,
} from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Link from "next/link";
import { Toast, Spin } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { formatDate, getUniqueRecords } from "@/libs/common";
import { withAuth } from "@/contexts/withAuth";
import { VChart } from "@visactor/react-vchart";
import { IconSearch } from "@douyinfe/semi-icons";

const ExaminatedRecordListPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [recordIdDelete, setRecordIdDelete] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalEmrs, setTotalEmrs] = useState(0);
  const [loadingTotalEmr, setLoadingTotalEmr] = useState(false);
  const [survivalIndexStatistic, setSurvivalIndexStatistic] = useState({});
  const [loadingSurvivalIndexStatistic, setLoadingSurvivalIndexStatistic] =
    useState(false);

  const pageSize = 10;
  let toast = {
    content: "",
    duration: 3,
  };

  const handleSearch = () => {
    setLoading(true);
    if (searchQuery.trim() !== "") {
      axios
        .get(
          `${medicineServiceAPI}/ExaminatedRecord/SearchAdmin/name?name=${searchQuery}`,
          {
            headers: headerConfig,
          }
        )
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleUpdate = () => {
    setLoading(true);
  };

  const showDialog = (recordId) => {
    console.log(recordId);
    setVisible(true);
    setRecordIdDelete(recordId);
  };

  const handleOk = () => {
    setLoading(true);
    axios
      .put(
        `${medicineServiceAPI}/ExaminatedRecord/Delete?id=${recordIdDelete}`,
        null,
        {
          headers: headerConfig,
        }
      )
      .then((response) => {
        toast.content = response.data.message;
        Toast.success(toast);
        setRecordIdDelete(0);
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
    setRecordIdDelete(0);
    setVisible(false);
  };

  const getData = () => {
    return axios
      .get(`${medicineServiceAPI}/ExaminatedRecord`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
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
      return targetObject.firstName + " " + targetObject.lastName;
    } else {
      return null; // or any other value or indication of not found
    }
  };

  useEffect(() => {
    getData();
    fetchData();

    //fetch users
    axios
      .get(`${userServiceAPI}/Authentication`, {
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

    //fetch patients
    axios
      .get(`${userServiceAPI}/Authentication/Patients`, {
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

    // For fetch total emr
    axios
      .get(`${medicineServiceAPI}/ExaminatedRecord`, {
        headers: headerConfig,
      })
      .then((response) => {
        setTotalEmrs(response.data.totalDataList);
        setLoadingTotalEmr(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }, []);

  const columns = [
    {
      title: "Record ID",
      dataIndex: "recordId",
      sorter: (a, b) => (a.recordId - b.recordId > 0 ? 1 : -1),
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorName",
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",

      render: (text) => text || <span style={{ color: "red" }}>Empty</span>,
    },
    {
      title: "Respiration Rate",
      dataIndex: "respirationRate",
      sorter: (a, b) => (a.respirationRate - b.respirationRate > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: "red" }}>Empty</span>,
    },
    {
      title: "Temperature",
      dataIndex: "temperature",
      sorter: (a, b) => (a.temperature - b.temperature > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: "red" }}>Empty</span>,
    },
    {
      title: "Blood Pressure",
      dataIndex: "bloodPressure",
      sorter: (a, b) => (a.bloodPressure - b.bloodPressure > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: "red" }}>Empty</span>,
    },
    {
      title: "SpO2",
      dataIndex: "spO2",
      sorter: (a, b) => (a.spO2 - b.spO2 > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: "red" }}>Empty</span>,
    },
    {
      title: "Symptoms",
      dataIndex: "symptoms",
      sorter: (a, b) => (a.symptoms - b.symptoms > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: "red" }}>Empty</span>,
    },
    {
      title: "Note",
      dataIndex: "note",
      sorter: (a, b) => (a.note - b.note > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: "red" }}>Empty</span>,
    },
    {
      title: "CreatedDate",
      dataIndex: "createdDate",
      sorter: (a, b) => (a.createdDate - b.createdDate > 0 ? 1 : -1),
      render: (text) => formatDate(text) || <span style={{ color: "red" }}>Empty</span>,
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
                  <Link
                    href={`/admin/examinatedRecord/update/${record.recordId}`}
                  >
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
                    onClick={() => showDialog(record.recordId)}
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
    <SemiLocaleProvider locale={en_US}>
      <div className="flex flex-col items-start w-full p-8 mt-5">
        <HeaderAdminManagementComponent
          content={"Examinated Record Management"}
        />
        <div className="flex items-center mt-4">
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
              Statistic
            </span>
          </h1>
        </div>

        <div className="flex gap-4 w-full bg-slate-200 rounded-2xl p-4 mb-6">
          <div className="flex flex-col gap-4 justify-center items-center w-full">
            {loadingSurvivalIndexStatistic ? (
              <VChart
                spec={{
                  height: 400,
                  ...survivalIndexStatistic,
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
              {loadingTotalEmr ? (
                <div className="h-40 rounded-xl shadow-md p-6 bg-white min-w-[17rem]">
                  <div className="font-semibold mb-1 text-lg">
                    Total Examinated Record
                  </div>
                  <div className="font-semibold text-5xl tracking-tight">
                    {totalEmrs}
                  </div>
                  <div className="font-normal">Records</div>
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
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-center">
                <div className="font-bold mb-4">
                  No information available to display
                </div>
                <Link href={"/admin/medicalExaminatedRecord/create"}>
                  <Button>Go to Create Examinated Record Page</Button>
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
                <div className="flex items-start justify-start">
                  <input
                    type="text"
                    placeholder="Search by first name(last name) of doctor(patient)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="border-t-[1px] border-l-[1px] border-b-[1px] border-gray-300 rounded-l-lg p-2 bg-gray-100 h-3/4 mt-2 focus:outline-none"
                  />
                  <Button
                    onClick={handleSearch}
                    style={{
                      height: "75%",
                      borderRadius: "0",
                      marginLeft: "-1px",
                      backgroundColor: "rgb(243 244 246)",
                      color: "rgb(107 114 128)",
                      fontWeight: "bold",
                      transition: "all 0.3s",
                      borderTopRightRadius: "8px",
                      borderBottomRightRadius: "8px",
                      marginTop: 8,
                      borderTop: "1px solid rgb(209 213 219)",
                      borderRight: "1px solid rgb(209 213 219)",
                      borderBottom: "1px solid rgb(209 213 219)",
                    }}
                  >
                    <IconSearch className="pt-1"></IconSearch>
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
                style={{ paddingTop: "1.25rem" }}
              />
            </SemiLocaleProvider>
          </>
        )}
      </div>
    </SemiLocaleProvider>
  );
};

export default withAuth(ExaminatedRecordListPage, adminRole);
