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
import { formatDate } from "@/libs/common";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { getUniqueRecords } from "@/libs/common";
import { withAuth } from "@/contexts/withAuth";
import { VChart } from "@visactor/react-vchart";

const PatientPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [roles, setRoles] = useState([]);
  const pageSize = 10;
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingTotalUsers, setLoadingTotalUsers] = useState(false);
  const [statisticNumberUserByGender, setStatisticNumberUserByGender] =
    useState({});
  const [
    loadingStatisticNumberUserByGender,
    setLoadingStatisticNumberUserByGender,
  ] = useState(false);

  let toast = {
    content: "",
    duration: 3,
  };

  const getData = () => {
    return axios
      .get(`${userServiceAPI}/Authentication/Patients`, {
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
    let targetObject = arr.find((obj) => obj.roleId === targetIndex);

    if (targetObject) {
      return targetObject.roleName;
    } else {
      return null;
    }
  };

  useEffect(() => {
    getData();
    fetchData();
    axios
      .get(`${userServiceAPI}/Role`, {
        headers: headerConfig,
      })
      .then((response) => {
        const dataArr = response.data.data;
        const uniqueRecords = getUniqueRecords(dataArr, "roleId");
        console.log(uniqueRecords);
        setRoles(uniqueRecords);
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
              text: "Statistics of number patient by gender",
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
          setStatisticNumberUserByGender(barChart);
          setLoadingStatisticNumberUserByGender(true);
        }
        setTotalUsers(response.data.totalDataList);
        setLoadingTotalUsers(true);
      });
  }, []);
  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      sorter: (a, b) => (a.userId - b.userId > 0 ? 1 : -1),
    },
    {
      title: "User Name",
      dataIndex: "username",
      sorter: (a, b) => (a.username - b.username > 0 ? 1 : -1),
    },
    {
      title: "Role",
      dataIndex: "roleId",
      render: (roleId) => getValueByIndex(roles, roleId),
      sorter: (a, b) => (a.roleId - b.roleId > 0 ? 1 : -1),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a, b) => (a.gender - b.gender > 0 ? 1 : -1),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      sorter: (a, b) => (a.firstName - b.firstName > 0 ? 1 : -1),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: (a, b) => (a.lastName - b.lastName > 0 ? 1 : -1),
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      sorter: (a, b) => (a.birthday - b.birthday > 0 ? 1 : -1),
      render: (text) => formatDate(text),
    },
    {
      title: "PhoneNumber",
      dataIndex: "phoneNumber",
      sorter: (a, b) => (a.phoneNumber - b.phoneNumber > 0 ? 1 : -1),
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
      <HeaderAdminManagementComponent content={"List Patient"} />
      <div className="flex items-center mt-4">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
            Statistic
          </span>
        </h1>
      </div>
      <div className="flex gap-4 w-full bg-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          {loadingStatisticNumberUserByGender ? (
            <VChart
              spec={{
                height: 400,
                ...statisticNumberUserByGender,
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
            {loadingTotalUsers ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-white min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">Total Patients</div>
                <div className="font-semibold text-5xl tracking-tight">
                  {totalUsers}
                </div>
                <div className="font-normal">Patients</div>
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
  );
};

export default withAuth(PatientPage, adminRole);
