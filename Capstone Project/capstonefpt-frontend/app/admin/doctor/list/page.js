"use client";
import { IconMore } from "@douyinfe/semi-icons";
import { Table } from "@douyinfe/semi-ui";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Dropdown, Modal, Button } from "@douyinfe/semi-ui";
import {
  adminRole,
  headerConfig,
  userServiceAPI,
} from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Link from "next/link";
import { formatDate } from "@/libs/common";
import { Toast, Spin } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";
import { VChart } from "@visactor/react-vchart";
import { IconSearch } from "@douyinfe/semi-icons";

const DoctorListPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [filterGender, setFilterGender] = useState([]);
  const [userIdDelete, setUserIdDelete] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loadingTotalDoctors, setLoadingTotalDoctors] = useState(false);
  const [statisticNumberDoctorByGender, setStatisticNumberDoctorByGender] =
    useState({});
  const [
    loadingStatisticNumberDoctorByGender,
    setLoadingStatisticNumberDoctorByGender,
  ] = useState(false);

  // toast
  let toast = {
    content: "",
    duration: 3,
  };

  //Change to update page
  const handleUpdate = () => {
    setLoading(true);
  };

  //handle modal state
  const showDialog = (userId) => {
    setVisible(true);
    setUserIdDelete(userId);
  };

  const handleOk = () => {
    setLoading(true);
    axios
      .put(`${userServiceAPI}/Authentication/id?id=${userIdDelete}`, null, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.message);
        toast.content = response.data.message;
        Toast.success(toast);
        setUserIdDelete(0);
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
    setUserIdDelete(0);
    setVisible(false);
  };

  const getData = () => {
    return axios
      .get(`${userServiceAPI}/Authentication/Doctors`, {
        headers: headerConfig,
      })
      .then((response) => {
        setTotal(response.data.totalDataList);
        if (JSON.stringify(response.data.data) == "[]") {
          setIsEmptyData(true);
        }
        let doctorlist = response.data.data;
        const uniqueRoles = [...new Set(doctorlist.map((item) => item.gender))];

        const dataArr = uniqueRoles.map((gender) => ({
          text: gender,
          value: gender,
        }));

        // Setting the state with unique roleName values
        setFilterGender(dataArr);

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

    //handle get data doctors
    let dataDoctors;
    getData()
      .then((result) => {
        console.log(result); // Handle the data here
        dataDoctors = result; // Assign the result to a variable dataDoctors
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = dataDoctors;
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
    getData();
    fetchData();

    // For fetch total doctors
    axios
      .get(`${userServiceAPI}/Authentication/Doctors`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        let users = response.data.data;
        if (users.length !== 0) {
          const male = users.filter(
            (item) => item.gender.toLowerCase() === "male"
          );
          const female = users.filter(
            (item) => item.gender.toLowerCase() === "female"
          );
          const other = users.filter(
            (item) => item.gender.toLowerCase() === "unknown"
          );

          let barChart = {
            type: "bar",
            data: [
              {
                id: "barData",
                values: [
                  { idGender: 1, gender: "Male", value: male.length },
                  { idGender: 2, gender: "Female", value: female.length },
                  { idGender: 3, gender: "Other", value: other.length },
                ],
              },
            ],
            title: {
              visible: true,
              text: "Statistics of number doctor by gender",
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
            xField: "gender",
            yField: "value",
          };
          setStatisticNumberDoctorByGender(barChart);
          setLoadingStatisticNumberDoctorByGender(true);
        }
        setTotalDoctors(response.data.totalDataList);
        setLoadingTotalDoctors(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }, []);

  const columns = [
    {
      title: "UserID",
      dataIndex: "userId",
      sorter: (a, b) => (a.UserId - b.UserId > 0 ? 1 : -1),
    },
    {
      title: "User Name",
      dataIndex: "username",
      sorter: (a, b) => (a.username - b.username > 0 ? 1 : -1),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      sorter: (a, b) => (a.experience - b.experience > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: 'red' }}>Empty</span>
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: filterGender,
      onFilter: (value, record) => record.gender.includes(value),
    },
    {
      title: "Major",
      dataIndex: "major",
      sorter: (a, b) => (a.major - b.major > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: 'red' }}>Empty</span>
    },
    {
      title: "Qualification",
      dataIndex: "qualification",
      sorter: (a, b) => (a.qualification - b.qualification > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: 'red' }}>Empty</span>
    },
    {
      title: "Workplace",
      dataIndex: "workPlace",
      sorter: (a, b) => (a.workPlace - b.workPlace > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: 'red' }}>Empty</span>
    },
    {
      title: "Date of Birth",
      dataIndex: "birthday",
      sorter: (a, b) => a.birthday.localeCompare(b.birthday),
      render: (text) => formatDate(text),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      sorter: (a, b) => (a.phoneNumber - b.phoneNumber > 0 ? 1 : -1),
    },
    {
      title: "Emergency Contact",
      dataIndex: "emergencyContact",
      sorter: (a, b) => (a.emergencyContact - b.emergencyContact > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: 'red' }}>Empty</span>
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
                  <Link href={`/admin/doctor/update/${record.userId}`}>
                    <Button
                      onClick={handleUpdate}
                      style={{
                        color: "#ffffff",
                        backgroundColor: "#1890ff",
                        borderColor: "#1890ff",
                        width: "100px",
                      }}
                    >
                      Update
                    </Button>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Button
                    onClick={() => showDialog(record.userId)}
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

  const handleSearch = () => {
    setLoading(true);
    if (searchQuery.trim() !== "") {
      axios
        .get(
          `${userServiceAPI}/Authentication/SearchDoctor/name?name=${searchQuery}`,
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

  return (
    <div className="flex flex-col items-start w-full p-8 mt-5">
      {/* -------- Title -------- */}
      <HeaderAdminManagementComponent content={"Doctor Management"} />
      <div className="flex items-center mt-4">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
            Statistic
          </span>
        </h1>
      </div>
      <div className="flex gap-4 w-full bg-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          {loadingStatisticNumberDoctorByGender ? (
            <VChart
              spec={{
                height: 400,
                ...statisticNumberDoctorByGender,
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
            {loadingTotalDoctors ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-white min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">Total Doctors</div>
                <div className="font-semibold text-5xl tracking-tight">
                  {totalDoctors}
                </div>
                <div className="font-normal">Doctors</div>
              </div>
            ) : (
              <div className="h-40 rounded-xl shadow-md p-6 bg-white flex justify-center items-center">
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
              <Link href={"/doctor/create"}>
                <Button>Go to Create Doctor Page</Button>
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
            />
          </SemiLocaleProvider>
        </>
      )}
    </div>
  );
};

export default withAuth(DoctorListPage, adminRole);
