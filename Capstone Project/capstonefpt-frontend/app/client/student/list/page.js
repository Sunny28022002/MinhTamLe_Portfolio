"use client";
import { IconMore } from "@douyinfe/semi-icons";
import { Table, Button, Dropdown, Modal } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { headerConfig, userServiceAPI } from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Link from "next/link";
import { formatDate } from "@/libs/common";
import { Toast } from "@douyinfe/semi-ui";

import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";

const StudentListClientPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [filterGender, setFilterGender] = useState([]);
  const [userIdDelete, setUserIdDelete] = useState(0);
  const pageSize = 10;

  let toast = {
    content: "",
    duration: 3,
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
        console.log(response);
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
      .get(`${userServiceAPI}/Authentication/Students`, {
        headers: headerConfig,
      })
      .then((response) => {
        setTotal(response.data.totalDataList);
        if (JSON.stringify(response.data.data) == "[]") {
          setIsEmptyData(true);
        }
        let studentlist = response.data.data;
        const uniqueRoles = [
          ...new Set(studentlist.map((item) => item.gender)),
        ];
        const dataArr = uniqueRoles.map((gender) => ({
          text: gender,
          value: gender,
        }));
        setFilterGender(dataArr);
        return response.data.data;
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  const fetchData = (currentPage = 1) => {
    setLoading(true);
    setPage(currentPage);

    let dataStudents;
    getData()
      .then((result) => {
        console.log(result);
        dataStudents = result;
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });

    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = dataStudents;
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
    fetchData();
  }, []);

  const columns = [
    {
      title: "UserID",
      dataIndex: "userId",
      sorter: (a, b) => (a.userId - b.userId > 0 ? 1 : -1),
    },
    {
      title: "User Name",
      dataIndex: "username",
      sorter: (a, b) => (a.username - b.username > 0 ? 1 : -1),
    },
    {
      title: "Student Code",
      dataIndex: "studentCode",
      sorter: (a, b) => (a.studentCode - b.studentCode > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: 'red' }}>Empty</span>
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: filterGender,
      onFilter: (value, record) => record.gender.includes(value),
    },
    {
      title: "University",
      dataIndex: "university",
      sorter: (a, b) => (a.university - b.university > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: 'red' }}>Empty</span>
    },
    {
      title: "Session",
      dataIndex: "course",
      sorter: (a, b) => (a.course - b.course > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: 'red' }}>Empty</span>
    },
    {
      title: "Major",
      dataIndex: "major",
      sorter: (a, b) => (a.major - b.major > 0 ? 1 : -1),
    },
    {
      title: "Date of Birth",
      dataIndex: "birthday",
      sorter: (a, b) => (a.birthday - b.birthday > 0 ? 1 : -1),
      render: (text) => formatDate(text),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      sorter: (a, b) => (a.phoneNumber - b.phoneNumber > 0 ? 1 : -1),
    },
  ];
  const rowSelection = {
    getCheckboxProps: (record) => ({
      disabled: record.UserID === "Administrator",
      name: record.UserID,
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
    <LocaleProvider locale={en_US}>
      <div className="flex flex-col items-center w-full p-8 mt-5">
        <HeaderAdminManagementComponent content={"Student Management"} />
        {isEmptyData ? (
          <>
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-center">
                <div className="font-bold mb-4">
                  No information available to display
                </div>
                <Link href={"/student/create"}>
                  <Button>Go to Create Student Page</Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={dataSource}
              rowSelection={rowSelection}
              pagination={{
                currentPage,
                pageSize: 5,
                total: total,
                onPageChange: handlePageChange,
              }}
              loading={loading}
              style={{ paddingTop: "20px" }}
            />
          </>
        )}
      </div>
    </LocaleProvider>
  );
};

export default StudentListClientPage;
