"use client";
import { IconMore } from "@douyinfe/semi-icons";
import { Spin, Table } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown, Modal, Button } from "@douyinfe/semi-ui";
import {
  adminRole,
  headerConfig,
  userServiceAPI,
} from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { formatDate, getRoleFromToken } from "@/libs/common";
import Link from "next/link";
import { Toast } from "@douyinfe/semi-ui";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { withAuth } from "@/contexts/withAuth";
import { VChart } from "@visactor/react-vchart";
import { IconSearch } from "@douyinfe/semi-icons";

const UserListAdminPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [userIdDelete, setUserIdDelete] = useState(0);
  const [filterRole, setFilterRole] = useState([]);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");

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

  let toast = {
    content: "",
    duration: 3,
  };

  const handleSearch = () => {
    setLoading(true);
    if (searchQuery.trim() !== "") {
      axios
        .get(
          `${userServiceAPI}/Authentication/Search/name?name=${searchQuery}`,
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

  const showDialog = (userId) => {
    console.log(userId);
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
        toast.content = response.data.message;
        Toast.success(toast);
        setUserIdDelete(0);
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
    setUserIdDelete(0);
    setVisible(false);
  };

  const getData = () => {
    return axios
      .get(`${userServiceAPI}/Authentication/Users`, {
        headers: headerConfig,
      })
      .then((response) => {
        setTotal(response.data.totalDataList);
        if (JSON.stringify(response.data.data) == "[]") {
          setIsEmptyData(true);
        }
        let userlist = response.data.data;
        const uniqueRoles = [...new Set(userlist.map((item) => item.roleName))];
        const dataArr = uniqueRoles.map((roleName) => ({
          text: roleName,
          value: roleName,
        }));
        setFilterRole(dataArr);
        setTotalUsers(response.data.totalDataList);
        setLoadingTotalUsers(true);
        return response.data.data;
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  const fetchData = (currentPage = 1) => {
    setLoading(true);
    setPage(currentPage);

    let dataUsers;
    getData()
      .then((result) => {
        console.log(result);
        dataUsers = result;
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });

    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = dataUsers;
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

  const columns = [
    {
      title: "UserID",
      dataIndex: "userId",
      sorter: (a, b) => a.userId.localeCompare(b.userId),
    },
    {
      title: "User Name",
      dataIndex: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
      ],
      onFilter: (value, record) => record.gender === value,
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
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: "Role",
      dataIndex: "roleName",
      filters: filterRole,
      onFilter: (value, record) => record.roleName.includes(value),
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
                  <Link href={`/admin/user/update/${record.userId}`}>
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
      <HeaderAdminManagementComponent content={"User Management"} />
      <div className="flex items-center mt-4">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
            Statistic
          </span>
        </h1>
      </div>

      <div className="flex gap-4 w-full bg-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col gap-4 justify-center items-center w-6/12 ">
          {loadingStatisticNumberUserByRole ? (
            <VChart
              spec={{
                height: 400,
                ...statisticNumberUserByRole,
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
          <div className="flex gap-4">
            {loadingTotalUsers ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-blue-400 min-w-[17rem]">
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
              <div className="h-40 rounded-xl shadow-md p-6 bg-red-400 min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">Total Students</div>
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
          </div>

          <div className="flex gap-4">
            {loadingTotalStaffs ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-green-400 min-w-[17rem]">
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
              <div className="h-40 rounded-xl shadow-md p-6 bg-purple-400 min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">Total Doctors</div>
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
      </div>

      {isEmptyData ? (
        <>
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center">
              <div className="font-bold mb-4">
                No information available to display
              </div>
              <Link href={"/admin/user/create"}>
                <Button>Go to Create User Page</Button>
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
            <div className="flex w-full">
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
            </div>
          </SemiLocaleProvider>
        </>
      )}
    </div>
  );
};

export default withAuth(UserListAdminPage, adminRole);
