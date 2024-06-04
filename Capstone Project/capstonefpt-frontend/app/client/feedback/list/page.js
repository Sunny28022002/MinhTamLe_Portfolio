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
import { formatDate } from "@/libs/common";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { getUniqueRecords } from "@/libs/common";
import Cookies from "js-cookie";
import { getRoleFromToken } from "@/libs/common";
import { useAuth } from "@/contexts/AuthProvider";

const FeedbackHistoryClientPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;
  let token = Cookies.get("token");
  let userId = Cookies.get("userId");
  let { role } = useAuth();

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

  const getData = () => {
    const roleFromToken = getRoleFromToken(token);
    //console.log(roleFromToken);
    switch (roleFromToken) {
      case "Doctor":
        return axios
          .get(`${userServiceAPI}/Feedback/doctor/id?id=${userId}`, {
            headers: headerConfig,
          })
          .then((response) => {
            setTotal(response.data.totalDataList);
            if (JSON.stringify(response.data.data) == "[]") {
              setIsEmptyData(true);
            }

            console.log("Doctor Data: ", response.data.data);
            return response.data.data;
          })
          .catch((error) => {
            console.log("An error occurred:", error.response);
          });
      case "Student":
      case "Staff":
      case "Medical Staff":
        return axios
          .get(`${userServiceAPI}/Feedback/patient/id?id=${userId}`, {
            headers: headerConfig,
          })
          .then((response) => {
            console.log(response.data.data);
            setTotal(response.data.totalDataList);
            if (JSON.stringify(response.data.data) == "[]") {
              setIsEmptyData(true);
            }
            console.log("Medical Staff Data: ", response.data.data);
            return response.data.data;
          })
          .catch((error) => {
            console.log("An error occurred:", error.response);
          });
      default:
        return axios
          .get(`${userServiceAPI}/Feedback`, {
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
    }
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
  const getValueByIndex = (arr, id) => {
    let targetObject = arr.find((obj) => obj.userId === id);
    return targetObject ? (
      targetObject.fullname
    ) : (
      <span style={{ color: "red" }}>Empty</span>
    );
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
  }, []);
  useEffect(() => {
    console.log("Patients Data:", patients);
  }, [patients]);

  const columns = [
    {
      title: "Feedback ID",
      dataIndex: "feedbackId",
      sorter: (a, b) => (a.feedbackId - b.feedbackId > 0 ? 1 : -1),
    },
    {
      title: "Message",
      dataIndex: "message",
      sorter: (a, b) => (a.message - b.message > 0 ? 1 : -1),
    },
    {
      title: "Feedback Date",
      dataIndex: "feedbackDate",
      sorter: (a, b) => (a.feedbackDate - b.feedbackDate > 0 ? 1 : -1),
      render: (text) => formatDate(text),
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorId",
      render: doctorId => getValueByIndex(doctors, doctorId),
    },
    {
      title: "Patient Name",
      dataIndex: "patientId",
      render: patientId => getValueByIndex(patients, patientId),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => (a.rating - b.rating > 0 ? 1 : -1),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (isActive) => (isActive ? "True" : "False"),
    },
  ];

  return (
    <div className="flex flex-col w-full p-8 mt-5">
      <HeaderAdminManagementComponent content={"Feedback History"} />
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
            <div className="flex items-start justify-start mt-2">
              <input
                type="text"
                placeholder="Search by feedback name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border border-gray-300 rounded-l p-2 bg-gray-100"
              />
              <Button
                onClick={handleSearch}
                style={{
                  height: "100%",
                  borderRadius: "0",
                  marginLeft: "-1px",
                  backgroundColor: "#4361EE",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                  borderTopRightRadius: "8px",
                  borderBottomRightRadius: "8px",
                }}
              >
                Search
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={dataSource}
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

export default FeedbackHistoryClientPage;
