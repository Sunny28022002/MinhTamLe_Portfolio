"use client";
import { IconMore } from "@douyinfe/semi-icons";
import { Table } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown, Modal, Button } from "@douyinfe/semi-ui";
import {
  adminRole,
  headerConfig,
  userServiceAPI,
} from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Link from "next/link";
import { Toast, Spin } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";
import { VChart } from "@visactor/react-vchart";
import { IconSearch } from "@douyinfe/semi-icons";

const RoleListPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [roleIdDelete, setRoleIdDelete] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;
  const [totalRoles, setTotalRole] = useState(0);
  const [loadingTotalRole, setLoadingTotalRole] = useState(false);
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
        .get(`${userServiceAPI}/Role/Search/name?name=${searchQuery}`, {
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

  const showDialog = (roleId) => {
    console.log(roleId);
    setVisible(true);
    setRoleIdDelete(roleId);
  };

  const handleOk = () => {
    setLoading(true);
    axios
      .put(`${userServiceAPI}/Role/Delete/id?id=${roleIdDelete}`, null, {
        headers: headerConfig,
      })
      .then((response) => {
        toast.content = response.data.message;
        Toast.success(toast);
        setRoleIdDelete(0);
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
    setRoleIdDelete(0);
    setVisible(false);
  };

  const getData = () => {
    return axios
      .get(`${userServiceAPI}/Role`, {
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

    let dataRoles;
    getData()
      .then((result) => {
        console.log(result);
        dataRoles = result;
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });

    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = dataRoles;
        //let filteredData = data?.filter((role) => role.isActive);
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
    // For fetch total role
    axios
      .get(`${userServiceAPI}/Role`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalRole(response.data.totalDataList);
        setLoadingTotalRole(true);
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

        setStatisticPercentageUserByRole(pieChart);
        setLoadingStatisticPercentageUserByRole(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }, []);

  const columns = [
    {
      title: "Role ID",
      dataIndex: "roleId",
      sorter: (a, b) => a.roleId.localeCompare(b.roleId),
    },
    {
      title: "Role Name",
      dataIndex: "roleName",
      sorter: (a, b) => a.roleName.localeCompare(b.roleName),
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
                  <Link href={`/admin/role/update/${record.roleId}`}>
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
                    onClick={() => showDialog(record.roleId)}
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
    <div className="flex flex-col items-start w-full p-8 mt-5">
      <HeaderAdminManagementComponent content={"Role Management"} />
      <div className="flex items-center mt-4">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
            Statistic
          </span>
        </h1>
      </div>
      <div className="flex gap-4 w-full bg-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          {loadingStatisticPercentageUserByRole ? (
            <VChart
              spec={{
                height: 400,
                ...statisticPercentageUserByRole,
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
            {loadingTotalRole ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-white min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">Total Roles</div>
                <div className="font-semibold text-5xl tracking-tight">
                  {totalRoles}
                </div>
                <div className="font-normal">Roles</div>
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
              <Link href={"/admin/unit/create"}>
                <Button>Go to Create Role Page</Button>
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
                  placeholder="Search by role name..."
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
  );
};

export default withAuth(RoleListPage, adminRole);
