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
import { withAuth } from "@/contexts/withAuth";
import { VChart } from "@visactor/react-vchart";
import { IconSearch } from "@douyinfe/semi-icons";

const MedicinePage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [MedicineIdDelete, setMedicineIdDelete] = useState(0);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [units, setUnits] = useState([]);
  const [users, setUsers] = useState([]);
  const [codes, setCodes] = useState([]);
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

  let toast = {
    content: "",
    duration: 3,
  };
  const handleSearch = () => {
    setLoading(true);
    if (searchQuery.trim() !== "") {
      axios
        .get(`${medicineServiceAPI}/Medicine/Search/name?name=${searchQuery}`, {
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleUpdate = () => {
    setLoading(true);
  };

  const showDialog = (medicineId) => {
    console.log(medicineId);
    setVisible(true);
    setMedicineIdDelete(medicineId);
  };

  const handleOk = () => {
    setLoading(true);
    axios
      .put(
        `${medicineServiceAPI}/Medicine/Delete?id=${MedicineIdDelete}`,
        null,
        {
          headers: headerConfig,
        }
      )
      .then((response) => {
        toast.content = response.data.message;
        Toast.success(toast);
        setMedicineIdDelete(0);
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
    setMedicineIdDelete(0);
    setVisible(false);
  };

  const getData = () => {
    return axios
      .get(`${medicineServiceAPI}/Medicine`, {
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
    let targetObject = arr.find((obj) => obj.unitId === targetIndex);

    if (targetObject) {
      return targetObject.unitName;
    } else {
      return null;
    }
  };
  const getValueByIndex2 = (arr, targetIndex) => {
    let targetObject = arr.find((obj) => obj.codeId === targetIndex);

    if (targetObject) {
      return targetObject.codeName;
    } else {
      return null;
    }
  };
  const getValueByIndex3 = (arr, targetIndex) => {
    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
      return targetObject.fullname;
    } else {
      return null;
    }
  };

  useEffect(() => {
    getData();
    fetchData();
    axios
      .get(`${medicineServiceAPI}/Unit`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setUnits(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});

    axios
      .get(`${medicineServiceAPI}/MedicineCode`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setCodes(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});

    axios
      .get(`${userServiceAPI}/Authentication/Users`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
  }, []);

  useEffect(() => {
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
  }, [])

  const columns = [
    {
      title: "Medicine ID",
      dataIndex: "medicineId",
      sorter: (a, b) => (a.medicineId - b.medicineId > 0 ? 1 : -1),
    },
    {
      title: "User Name",
      dataIndex: "userId",
      render: (userId) => getValueByIndex3(users, userId),
    },
    {
      title: "Unit Name",
      dataIndex: "unitId",
      render: (unitId) => getValueByIndex(units, unitId),
    },
    {
      title: "Code Name",
      dataIndex: "codeId",
      render: (codeId) => getValueByIndex2(codes, codeId),
    },
    {
      title: "Medicine Name",
      dataIndex: "medicineName",
      sorter: (a, b) => (a.medicineName - b.medicineName > 0 ? 1 : -1),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: (a, b) => (a.quantity - b.quantity > 0 ? 1 : -1),
    },
    {
      title: "Price Per Unit",
      dataIndex: "pricePerUnit",
      sorter: (a, b) => (a.pricePerUnit - b.pricePerUnit > 0 ? 1 : -1),
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
                  <Link href={`/admin/medicine/update/${record.medicineId}`}>
                    <Button
                      style={{
                        color: "#ffffff",
                        backgroundColor: "#1890ff",
                        borderColor: "#1890ff",
                        width: "100px",
                      }}
                      onClick={handleUpdate}
                    >
                      Update
                    </Button>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Button
                    onClick={() => showDialog(record.medicineId)}
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
    <div className="flex flex-col items-start w-full p-8 mt-5">
      <HeaderAdminManagementComponent content={"Medicine Management"} />
      <div className="flex items-center mt-4">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
            Statistic
          </span>
        </h1>
      </div>

      <div className="flex gap-4 w-full bg-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col gap-4 justify-center items-center w-6/12 ">
          {loadingPercentageMedicineCode ? (
            <>
              <VChart
                spec={{
                  height: 400,
                  ...percentageMedicineCode,
                }}
                option={{
                  mode: "desktop-browser",
                }}
              />
            </>
          ) : (
            <>
              <div className="">
                <Spin aria-label="Spinner button example" />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 justify-center items-center w-6/12">
          <div className="flex gap-4">
            {loadingTotalActiveMedicine ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-blue-400 min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">
                  Total Active Medicines
                </div>
                <div className="font-semibold text-5xl tracking-tight">
                  {totalActiveMedicine}
                </div>
                <div className="font-normal">Medicines</div>
              </div>
            ) : (
              <div className="h-40 rounded-xl shadow-md p-6 bg-blue-400 flex justify-center items-center">
                <Spin aria-label="Spinner button example" />
              </div>
            )}

            {loadingTotalInActiveMedicine ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-red-400 min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">
                  Total In-active Medicines
                </div>
                <div className="font-semibold text-5xl tracking-tight">
                  {totalInActiveMedicine}
                </div>
                <div className="font-normal">Medicines</div>
              </div>
            ) : (
              <div className="h-40 rounded-xl shadow-md p-6 bg-red-400 flex justify-center items-center">
                <Spin aria-label="Spinner button example" />
              </div>
            )}
          </div>
          <div className="flex gap-4">
            {loadingTotalMedicines ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-green-400 min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">
                  Total Medicines
                </div>
                <div className="font-semibold text-5xl tracking-tight">
                  {totalMedicines}
                </div>
                <div className="font-normal">Medicines</div>
              </div>
            ) : (
              <div className="h-40 rounded-xl shadow-md p-6 bg-green-400 flex justify-center items-center">
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
              <Link href={"/admin/medicine/create"}>
                <Button>Go to Create Medicine Page</Button>
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
                  placeholder="Search by name..."
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
              style={{ paddingTop: "20px" }}
            />
          </SemiLocaleProvider>
        </>
      )}
    </div>
  );
};

export default withAuth(MedicinePage, adminRole);
