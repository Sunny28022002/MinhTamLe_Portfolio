"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Spin } from "@douyinfe/semi-ui";
import axios from "axios";
import { headerConfig, blogServiceAPI } from "../../../../libs/highmedicineapi";
import { FaPlusCircle } from "react-icons/fa";

const BlogListClientPage = () => {
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    if (searchQuery.trim() !== "") {
      axios
        .get(`${blogServiceAPI}/Blogs/Search/title?title=${searchQuery}`, {
          headers: headerConfig,
        })
        .then((response) => {
          setBlogs(response.data.data);
          setIsEmptyData(response.data.data.length === 0);
          setTotal(response.data.totalDataList);
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

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const fetchData = () => {
    axios
      .get(`${blogServiceAPI}/Blogs`, {
        headers: headerConfig,
      })
      .then((response) => {
        if (JSON.stringify(response.data.data) === "[]") {
          setIsEmptyData(true);
        } else {
          setBlogs(response.data.data);
          setIsEmptyData(false);
          setSpinner(false);
        }
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center w-full p-8 mt-5 space-y-2">
      {/* -------- Title -------- */}
      <div className="flex w-full font-semibold text-2xl">
        Health Blog{" "}
        {/* <Link href={"/client/blog/create"}>
          <FaPlusCircle className="mt-1 ml-1" />
        </Link> */}
      </div>
      <div className="w-full text-base text-content-neutral-2">
        Create blog articles about health every day to help readers gain more
        useful knowledge about health
      </div>
      {/* Table */}
      <div className="flex items-center w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search by title..."
          className="border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:border-blue-500"
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
      {isEmptyData ? (
        <>
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center">
              <div className="font-bold mb-4">
                No information available to display
              </div>
              <Link href={"/client/blog/create"}>
                <Button>Go to Create Blog Page</Button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap w-full">
          {spinner ? (
            <div className="flex w-full justify-center items-center gap-4 mt-6">
              <Spin aria-label="Spinner button example" />
            </div>
          ) : (
            blogs.map((blog, index) => (
              <Link key={index} href={`/client/blog/detail/${blog.blogId}`}>
                <div className="flex flex-col w-64 mr-4 mt-4 hover:scale-y-105 transition ease-out duration-500">
                  <div className="w-full h-40 bg-bg-neutral-4 rounded-md p-3">
                    <p className="font-bold text-2xl text-white">
                      {blog.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-content-neutral-2">
                      Create date:{" "}
                      {new Date(blog.publishedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BlogListClientPage;
