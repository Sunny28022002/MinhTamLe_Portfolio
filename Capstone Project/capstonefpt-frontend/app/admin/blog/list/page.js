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
  blogServiceAPI,
} from "@/libs/highmedicineapi";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import Link from "next/link";
import { Toast, Spin } from "@douyinfe/semi-ui";
import { formatDate } from "@/libs/common";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { VChart } from "@visactor/react-vchart";
import { IconSearch } from "@douyinfe/semi-icons";

const BlogListPage = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [BlogIdDelete, setBlogIdDelete] = useState(0);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loadingTotalBlogs, setLoadingTotalBlogs] = useState(false);
  const [totalBlogPublished, setTotalBlogPublished] = useState(0);
  const [loadingTotalBlogPublished, setLoadingTotalBlogPublished] =
    useState(false);
  const [totalBlogDraft, setTotalBlogDraft] = useState(0);
  const [loadingTotalBlogDraft, setLoadingTotalBlogDraft] = useState(false);
  const [statisticNumberBlogByStatus, setStatisticNumberBlogByStatus] =
    useState({});
  const [
    loadingStatisticNumberBlogByStatus,
    setLoadingStatisticNumberBlogByStatus,
  ] = useState(false);

  let toast = {
    content: "",
    duration: 3,
  };
  const handleSearch = () => {
    setLoading(true);
    if (searchQuery.trim() !== "") {
      axios
        .get(`${blogServiceAPI}/Blogs/Search/title?title=${searchQuery}`, {
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

  const showDialog = (blogId) => {
    console.log(blogId);
    setVisible(true);
    setBlogIdDelete(blogId);
  };

  const handleOk = () => {
    setLoading(true);
    axios
      .put(`${blogServiceAPI}/Blogs/Delete?id=${BlogIdDelete}`, null, {
        headers: headerConfig,
      })
      .then((response) => {
        toast.content = response.data.message;
        Toast.success(toast);
        setBlogIdDelete(0);
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
      .get(`${blogServiceAPI}/Blogs`, {
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
    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
      return targetObject.username;
    } else {
      return null;
    }
  };

  useEffect(() => {
    getData();
    fetchData();
    axios
      .get(`${userServiceAPI}/Authentication`, {
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

    axios
      .get(`${medicineServiceAPI}/Blogs`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        let blogs = response.data.data;
        if (blogs.length !== 0) {
          const published = blogs.filter((item) => item.isDraft === false);
          const draft = blogs.filter((item) => item.isDraft === true);

          let barChart = {
            type: "bar",
            data: [
              {
                id: "barData",
                values: [
                  { id: 1, status: "Published", value: published.length },
                  { id: 2, status: "Draft", value: draft.length },
                ],
              },
            ],
            title: {
              visible: true,
              text: "Statistics of number blog  posts by status",
            },
            legends: {
              visible: true,
              orient: "left",
              title: {
                visible: true,
                text: "Number of post",
              },
            },
            label: {
              // visible: true,
            },
            xField: "status",
            yField: "value",
          };
          setTotalBlogPublished(published.length);
          setTotalBlogDraft(draft.length);
          setStatisticNumberBlogByStatus(barChart);
          setLoadingTotalBlogDraft(true);
          setLoadingTotalBlogPublished(true);
          setLoadingStatisticNumberBlogByStatus(true);
        }
        setTotalBlogs(response.data.totalDataList);
        setLoadingTotalBlogs(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }, []);

  const columns = [
    {
      title: "Blog ID",
      dataIndex: "blogId",
      sorter: (a, b) => (a.blogId - b.blogId > 0 ? 1 : -1),
    },
    {
      title: "User Name",
      dataIndex: "userId",
      render: (userId) => getValueByIndex(users, userId),
    },
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => (a.title - b.title > 0 ? 1 : -1),
    },
    {
      title: "Content",
      dataIndex: "content",
      sorter: (a, b) => (a.content - b.content > 0 ? 1 : -1),
      render: (text) => {
        return (
          <>
            <p
              className="text"
              dangerouslySetInnerHTML={{
                __html: text.slice(0, 100),
              }}
            ></p>
            <p className="font-bold">...</p>
          </>
        );
      },
    },
    {
      title: "Writing Date",
      dataIndex: "writingDate",
      sorter: (a, b) => (a.writingDate - b.writingDate > 0 ? 1 : -1),
      render: (text) => formatDate(text),
    },
    {
      title: "Published Date",
      dataIndex: "publishedDate",
      sorter: (a, b) => (a.publishedDate - b.publishedDate > 0 ? 1 : -1),
      render: (text) => formatDate(text),
    },
    {
      title: "IsDraft",
      dataIndex: "isDraft",
      render: (isDraft) => (isDraft ? "True" : "False"),
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
                  <Link href={`/admin/blog/update/${record.blogId}`}>
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
                    onClick={() => showDialog(record.blogId)}
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
    <div className="flex flex-col w-full p-8 mt-5">
      <HeaderAdminManagementComponent content={"Blog Management"} />
      <div className="flex items-center mt-4">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
            Statistic
          </span>
        </h1>
      </div>
      <div className="flex gap-4 w-full bg-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col gap-4 justify-center items-center w-6/12">
          {loadingStatisticNumberBlogByStatus ? (
            <VChart
              spec={{
                height: 400,
                ...statisticNumberBlogByStatus,
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
            {loadingTotalBlogs ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-[#FFCDB2] min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">Total Blogs</div>
                <div className="font-semibold text-5xl tracking-tight">
                  {totalBlogs}
                </div>
                <div className="font-normal">Posts</div>
              </div>
            ) : (
              <div className="h-40 rounded-xl shadow-md p-6 bg-[#FFCDB2] flex justify-center items-center">
                <Spin aria-label="Spinner button example" />
              </div>
            )}

            {loadingTotalBlogPublished ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-[#B5838D] min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">
                  Total Published Blogs
                </div>
                <div className="font-semibold text-5xl tracking-tight">
                  {totalBlogPublished}
                </div>
                <div className="font-normal">Posts</div>
              </div>
            ) : (
              <div className="h-40 rounded-xl shadow-md p-6 bg-[#B5838D] flex justify-center items-center">
                <Spin aria-label="Spinner button example" />
              </div>
            )}
          </div>
          <div className="flex gap-4">
            {loadingTotalBlogDraft ? (
              <div className="h-40 rounded-xl shadow-md p-6 bg-[#E5989B] min-w-[17rem]">
                <div className="font-semibold mb-1 text-lg">
                  Total Draft Blogs
                </div>
                <div className="font-semibold text-5xl tracking-tight">
                  {totalBlogDraft}
                </div>
                <div className="font-normal">Posts</div>
              </div>
            ) : (
              <div className="h-40 rounded-xl shadow-md p-6 bg-[#E5989B] flex justify-center items-center">
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
              <Link href={"/admin/blog/create"}>
                <Button>Go to Create Blog Page</Button>
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
                  placeholder="Search by title..."
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

export default BlogListPage;
