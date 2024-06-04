"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@douyinfe/semi-ui";
import axios from "axios";
import Link from "next/link";
import {
  headerConfig,
  userServiceAPI,
  blogServiceAPI,
} from "@/libs/highmedicineapi";
import { useParams } from "next/navigation";
import { Spin } from "@douyinfe/semi-ui";

const BlogDetailClientPage = () => {
  const { Meta } = Card;
  const blogId = useParams().id;
  const [spinner, setSpinner] = useState(true);
  const [blog, setBlog] = useState([]);
  const [lastestBlog, setLastestBlog] = useState([]);
  const [user, setUser] = useState([]);
  const getNameById = (arr, targetIndex) => {
    if (arr.length === 0) {
      return null; // or any other value or indication of not found
    }

    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
      return targetObject.username;
    } else {
      return null; // or any other value or indication of not found
    }
  };

  useEffect(() => {
    axios
      .get(`${blogServiceAPI}/Blogs/id?id=${blogId}`, {
        headers: headerConfig,
      })
      .then((response) => {
        setBlog(response.data.data);
        setSpinner(false);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});

    axios
      .get(`${userServiceAPI}/Authentication`, {
        headers: headerConfig,
      })
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});

    axios
      .get(`${blogServiceAPI}/Blogs`, {
        headers: headerConfig,
      })
      .then((response) => {
        if (JSON.stringify(response.data.data) == "[]") {
          setIsEmptyData(true);
        } else {
          const arrBlog = response.data.data;
          const lastestBlog = arrBlog[arrBlog.length - 1];
          setLastestBlog(lastestBlog);
        }
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
  }, []);

  return (
    <>
      {spinner ? (
        <div className="flex w-full justify-center items-center gap-4">
          <Spin aria-label="Spinner button example" />
        </div>
      ) : (
        <div className="flex flex-col items-start w-full">
          <div className="w-full h-fit">
            <Image
              src="https://i.pinimg.com/564x/80/49/b8/8049b8bea3fde27ed9f62393e467b4ed.jpg"
              fill
              style={{
                objectFit: "cover",
              }}
              alt="Blog banner"
              className="!static !h-44"
            />
          </div>
          <div className="grid grid-cols-12 w-full mt-5">
            <div className="col-span-9 h-full mx-10">
              <p className="text-3xl mr-5 font-bold">{blog.title}</p>
              <p className="text-base text-content-neutral-2 mt-3">
                {new Date(blog.publishedDate).toLocaleDateString()} -{" "}
                {getNameById(user, blog.userId)}
              </p>
              <div className="blogContainer">
                <p
                  className="mt-3 text-justify"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                ></p>
              </div>
            </div>
            <div className="col-span-3 flex flex-col items-center">
              <div className="w-[85%] text-center bg-brand-neutral-5 p-3 rounded">
                <p className="font-bold text-xl">Latest blog posts</p>
              </div>
              <div className="mt-3">
                <Link href={`/client/blog/detail/${lastestBlog.blogId}`}>
                  <Card
                    className="hover:scale-105 transition ease-out duration-500 cursor-pointer"
                    style={{ maxWidth: 275 }}
                    cover={
                      <img
                        alt="example"
                        src="https://i.pinimg.com/564x/20/0c/3e/200c3e8e9474797f570b1e796078e3da.jpg"
                      />
                    }
                  >
                    <Meta title={lastestBlog?.title} />
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogDetailClientPage;
