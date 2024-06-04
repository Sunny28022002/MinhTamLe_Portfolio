"use client";
import { IconMore } from "@douyinfe/semi-icons";
import { Avatar, Table } from "@douyinfe/semi-ui";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Dropdown, Tag, Modal, Button } from "@douyinfe/semi-ui";
import { headerConfig, userServiceAPI } from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Link from "next/link";
import { formatDate } from "@/libs/common";
import { Toast } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";

const StaffListClientPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [filterGender, setFilterGender] = useState([]);
  const [userIdDelete, setUserIdDelete] = useState(0);
  const pageSize = 10;

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
      .get(`${userServiceAPI}/Authentication/Staffs`, {
        headers: headerConfig,
      })
      .then((response) => {
        setTotal(response.data.totalDataList);
        if (JSON.stringify(response.data.data) == "[]") {
          setIsEmptyData(true);
        }
        let doctorlist = response.data.data;
        const uniqueRoles = [...new Set(doctorlist.map((item) => item.gender))];

        // Creating dataArr with unique roleName values
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

    //handle get data staffs
    let dataStaffs;
    getData()
      .then((result) => {
        // console.log(result); // Handle the data here
        dataStaffs = result; // Assign the result to a variable dataDoctors
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = dataStaffs;
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

      render: (text) => text || <span style={{ color: 'red' }}>Empty</span>
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: filterGender,
      onFilter: (value, record) => record.gender.includes(value),

    },
    {
      title: "Experience",
      dataIndex: "experience",
      sorter: (a, b) => (a.experience - b.experience > 0 ? 1 : -1),
      render: (text) => text || <span style={{ color: 'red' }}>Empty</span>
    },
    {
      title: "Role Name",
      dataIndex: "roleName",
      sorter: (a, b) => (a.roleName - b.roleName > 0 ? 1 : -1),
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

  return (
    <SemiLocaleProvider locale={en_US}>
      <div className="flex flex-col items-center w-full p-8 mt-5">
        {/* -------- Title -------- */}
        <HeaderAdminManagementComponent content={"Staff Management"} />
        {/* Table */}
        {isEmptyData ? (
          <>
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-center">
                <div className="font-bold mb-4">
                  No information available to display
                </div>
                <Link href={"/staff/create"}>
                  <Button>Go to Create Staff Page</Button>
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
                pageSize: 10,
                total: total,
                onPageChange: handlePageChange,
              }}
              loading={loading}
            />
          </>
        )}
      </div>
    </SemiLocaleProvider>
  );
};

export default StaffListClientPage;
