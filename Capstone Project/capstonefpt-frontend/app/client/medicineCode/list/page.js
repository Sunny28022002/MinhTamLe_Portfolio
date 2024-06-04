"use client";
import { IconMore } from "@douyinfe/semi-icons";
import { Table } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown, Modal, Button } from "@douyinfe/semi-ui";
import { headerConfig, medicineServiceAPI } from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Link from "next/link";
import { Toast } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { getRoleFromToken } from "@/libs/common";

const MedicineCodeClientPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [MedicineCodeIdDelete, setMedicineCodeIdDelete] = useState(0);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState([]);

  let toast = {
    content: "",
    duration: 3,
  };
  const handleSearch = () => {
    setLoading(true);
    if (searchQuery.trim() !== "") {
      axios
        .get(
          `${medicineServiceAPI}/MedicineCode/Search/name?name=${searchQuery}`,
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

  const showDialog = (codeId) => {
    setVisible(true);
    console.log(codeId);
    setMedicineCodeIdDelete(codeId);
  };

  const handleOk = () => {
    setLoading(true);
    axios
      .put(
        `${medicineServiceAPI}/MedicineCode/Delete?id=${MedicineCodeIdDelete}`,
        null,
        {
          headers: headerConfig,
        }
      )
      .then((response) => {
        toast.content = response.data.message;
        Toast.success(toast);
        setMedicineCodeIdDelete(0);
        getData();
        fetchData();
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
    setMedicineCodeIdDelete(0);
    setVisible(false);
  };

  const getData = () => {
    return axios
      .get(`${medicineServiceAPI}/MedicineCode`, {
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
    let dataMedicineCode;
    getData()
      .then((result) => {
        console.log(result);
        dataMedicineCode = result;
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });

    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = dataMedicineCode;
        let filteredData = data?.filter(
          (medicineCode) => medicineCode.isActive
        );
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

  useEffect(() => {
    getData();
    fetchData();
    let token = Cookies.get("token");
    const roleFromToken = getRoleFromToken(token);

    let columnsTable = [
      {
        title: "Medicine Code ID",
        dataIndex: "codeId",
        sorter: (a, b) => (a.codeId - b.codeId > 0 ? 1 : -1),
      },
      {
        title: "Code Name",
        dataIndex: "codeName",
        sorter: (a, b) => (a.codeName - b.codeName > 0 ? 1 : -1),
      },
    ];
    // Authorization is here
    switch (roleFromToken) {
      case "Medical Staff":
        columnsTable.push({
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
                        href={`/client/medicineCode/update/${record.codeId}`}
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
                        onClick={() => showDialog(record.codeId)}
                        style={{
                          color: "#ffffff",
                          backgroundColor: "#ff4d4f",
                          borderColor: "#ff4d4f",
                          width: "6.25rem",
                        }}
                      >
                        Delete
                      </Button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <IconMore />
              </Dropdown>
            );
          },
        });
        setColumns(columnsTable);
        break;
      default:
        setColumns(columnsTable);
        break;
    }
  }, []);

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
      <HeaderAdminManagementComponent content={"Medicine Code Management"} />
      {isEmptyData ? (
        <>
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center">
              <div className="font-bold mb-4">
                No information available to display
              </div>
              <Link href={"/medicineCode/create"}>
                <Button>Go to Create Medicine Code Page</Button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <SemiLocaleProvider locale={en_US}>
            <div className="flex items-start justify-start mt-2">
              <input
                type="text"
                placeholder="Search by Code Name..."
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
                  marginLeft: "-0.0625rem",
                  backgroundColor: "#4361EE",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                  borderTopRightRadius: ".5rem",
                  borderBottomRightRadius: ".5rem",
                }}
              >
                Search
              </Button>
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
        </>
      )}
    </div>
  );
};

export default MedicineCodeClientPage;
