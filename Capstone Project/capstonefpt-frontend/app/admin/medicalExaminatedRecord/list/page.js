"use client";
import { IconMore } from "@douyinfe/semi-icons";
import { Table } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown, Modal, Button } from "@douyinfe/semi-ui";
import {
  adminRole,
  headerConfig,
  medicineServiceAPI,
} from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Link from "next/link";
import { Toast, Spin } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { getValueByIndex } from "@/libs/common";
import { withAuth } from "@/contexts/withAuth";
import { VChart } from "@visactor/react-vchart";
import { IconSearch } from "@douyinfe/semi-icons";

const MedicalExaminatedRecordListPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [MEIdDelete, setMEIdDelete] = useState(0);
  const pageSize = 10;
  let [records, setRecords] = useState([]);
  let [medicines, setMedicines] = useState([]);
  const [totalMer, setTotalMer] = useState(0);
  const [loadingTotalMer, setLoadingTotalMer] = useState(false);
  const [
    loadingExaminatedRecordStatistic,
    setLoadingExaminatedRecordStatistic,
  ] = useState(false);

  const [examinatedRecordStatistic, setExaminatedRecordStatistic] = useState(
    {}
  );

  let toast = {
    content: "",
    duration: 3,
  };

  const handleUpdate = () => {
    setLoading(true);
  };

  const showDialog = (meid) => {
    console.log(meid);
    setVisible(true);
    setMEIdDelete(meid);
  };

  useEffect(() => {
    axios
      .get(`${medicineServiceAPI}/ExaminatedRecord`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setTotalMer(response.data.totalDataList);
        setRecords(response.data.data);
        setLoadingTotalMer(true)
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});

    axios
      .get(`${medicineServiceAPI}/Medicine`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setMedicines(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});

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
  }, []);

  const handleOk = () => {
    setLoading(true);
    axios
      .put(
        `${medicineServiceAPI}/MedicineExaminatedRecord/Delete?id=${MEIdDelete}`,
        null,
        {
          headers: headerConfig,
        }
      )
      .then((response) => {
        toast.content = response.data.message;
        Toast.success(toast);
        setMEIdDelete(0);
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
    setMEIdDelete(0);
    setVisible(false);
  };

  const getData = () => {
    return axios
      .get(`${medicineServiceAPI}/MedicineExaminatedRecord`, {
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
    let targetObject = arr.find((obj) => obj.medicineId === targetIndex);

    if (targetObject) {
      return targetObject.medicineName;
    } else {
      return null; // or any other value or indication of not found
    }
  };

  useEffect(() => {
    getData();
    fetchData();
  }, []);

  const columns = [
    {
      title: "MeID",
      dataIndex: "meid",
      sorter: (a, b) => a.meid.localeCompare(b.meid),
    },
    {
      title: "Record ID",
      dataIndex: "recordId",
      sorter: (a, b) => a.recordId.localeCompare(b.recordId),
    },
    {
      title: "Medicine ID",
      dataIndex: "medicineId",
      sorter: (a, b) => a.medicineId.localeCompare(b.medicineId),
      render: (medicineId) => getValueByIndex(medicines, medicineId),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity.localeCompare(b.quantity),
    },
    {
      title: "Medication Guide",
      dataIndex: "medicationGuide",
      sorter: (a, b) => a.medicationGuide.localeCompare(b.medicationGuide),
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
                    href={`/admin/medicalExaminatedRecord/update/${record.meid}`}
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
                    onClick={() => showDialog(record.meid)}
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
          content={"Medical Examinated Record Management"}
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
            {loadingExaminatedRecordStatistic ? (
              <VChart
                spec={{
                  height: 400,
                  ...examinatedRecordStatistic,
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
              {loadingTotalMer ? (
                <div className="h-40 rounded-xl shadow-md p-6 bg-white min-w-[17rem]">
                  <div className="font-semibold mb-1 text-lg">
                    Total Medical Examinated Record
                  </div>
                  <div className="font-semibold text-5xl tracking-tight">
                    {totalMer}
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
                  <Button>Go to Create Medical Examinated Record Page</Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <SemiLocaleProvider locale={en_US}>
              <div className="flex items-center">
                <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-600 from-red-400">
                    Management
                  </span>{" "}
                </h1>
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

export default withAuth(MedicalExaminatedRecordListPage, adminRole);
