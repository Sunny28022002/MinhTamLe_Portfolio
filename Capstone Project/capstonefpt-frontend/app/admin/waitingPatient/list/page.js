"use client";
import { Table } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { formatDate } from "@/libs/common";
import Cookies from "js-cookie";
import {
  headerConfig,
  scheduleServiceAPI,
  userServiceAPI,
} from "@/libs/highmedicineapi";


const WaitingPatientListPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const pageSize = 10;
  const patientId = Cookies.get("userId");

  const getData = () => {
    return axios
      .get(
        `${scheduleServiceAPI}/Schedule/getWattingConfirmSchedule/patientId?id=${patientId}`,
        {
          headers: headerConfig,
        }
      )
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
    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
        console.log(targetObject)
      return targetObject.username;
    } else {
      return null;
    }
  };
  useEffect(() => {
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
      });
  }, []);

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "doctorId",
      render: (doctorId) => getValueByIndex(doctors, doctorId),
      sorter: (a, b) => (a.doctorId - b.doctorId > 0 ? 1 : -1),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => formatDate(date),
      sorter: (a, b) => (a.date - b.date > 0 ? 1 : -1),
    },
    {
      title: "Start Shift",
      dataIndex: "startShift",
      sorter: (a, b) => (a.startShift - b.startShift > 0 ? 1 : -1),
    },
    {
      title: "End Shift",
      dataIndex: "endShift",
      sorter: (a, b) => (a.endShift - b.endShift > 0 ? 1 : -1),
    },
    {
      title: "IsAccepted",
      dataIndex: "isAccepted",
      render: (isAccepted) => (isAccepted ? "True" : "False"),
    },
  ];

  return (
    <SemiLocaleProvider locale={en_US}>
      <div className="flex flex-col items-start w-full p-8 mt-5">
        <HeaderAdminManagementComponent
          content={"Waiting Patient list"}
        />
        {isEmptyData ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center">
              <div className="font-bold mb-4">
                No waiting schedules available to display
              </div>
            </div>
          </div>
        ) : (
          <SemiLocaleProvider locale={en_US}>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{
                current: currentPage,
                pageSize,
                total,
                onChange: handlePageChange,
              }}
              loading={loading}
              style={{ paddingTop: "1.25rem" }}
            />
          </SemiLocaleProvider>
        )}
      </div>
    </SemiLocaleProvider>
  );
};

export default WaitingPatientListPage;
