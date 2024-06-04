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
} from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Link from "next/link";
import { Toast } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { formatDate, getRoleFromToken, getUniqueRecords } from "@/libs/common";
import Cookies from "js-cookie";

const ExaminatedRecordListClientPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [recordIdDelete, setRecordIdDelete] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [columns, setColumns] = useState([]);

  const pageSize = 10;
  let toast = {
    content: "",
    duration: 3,
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
      return targetObject.username;
    } else {
      return null; // or any other value or indication of not found
    }
  };

  useEffect(() => {
    getData();
    fetchData();

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
        const dataArr = response.data.data;
        const uniqueRecords = getUniqueRecords(dataArr, "userId");
        console.log(uniqueRecords);
        setPatients(uniqueRecords);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});

    let token = Cookies.get("token");
    const roleFromToken = getRoleFromToken(token);

    let columnsTable = [
      {
        title: "Record ID",
        dataIndex: "recordId",
        sorter: (a, b) => (a.recordId - b.recordId > 0 ? 1 : -1),
      },
      {
        title: "Doctor Name",
        dataIndex: "doctorName",
        sorter: (a, b) => (a.doctorName - b.doctorName > 0 ? 1 : -1),
      },
      {
        title: "Patient Name",
        dataIndex: "patientName",
        sorter: (a, b) => (a.patientName - b.patientName > 0 ? 1 : -1),
      },
      {
        title: "Respiration Rate",
        dataIndex: "respirationRate",
        sorter: (a, b) => (a.respirationRate - b.respirationRate > 0 ? 1 : -1),
      },
      {
        title: "Temperature",
        dataIndex: "temperature",
        sorter: (a, b) => (a.temperature - b.temperature > 0 ? 1 : -1),
      },
      {
        title: "Blood Pressure",
        dataIndex: "bloodPressure",
        sorter: (a, b) => (a.bloodPressure - b.bloodPressure > 0 ? 1 : -1),
      },
      {
        title: "SpO2",
        dataIndex: "spO2",
        sorter: (a, b) => (a.spO2 - b.spO2 > 0 ? 1 : -1),
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
        render: (text) => text || <span style={{ color: 'red' }}>Empty</span>
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
    ];

    // Authorization is here
    switch (roleFromToken) {
      case "Doctor":
        columnsTable.push({
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
                        href={`/client/examinatedRecord/update/${record.recordId}`}
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
                    </Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <IconMore />
              </Dropdown>
            );
          },
        });
        setColumns(columnsTable);
        break;
      default:
        setColumns(columnsTable);
        break;
    }
  }, []);

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
        {isEmptyData ? (
          <>
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-center">
                <div className="font-bold mb-4">
                  No information available to display
                </div>
                <Link href={"/medicalExaminatedRecord/create"}>
                  <Button>Go to Create Examinated Record Page</Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <SemiLocaleProvider locale={en_US}>
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
          </>
        )}
      </div>
    </SemiLocaleProvider>
  );
};

export default ExaminatedRecordListClientPage;
