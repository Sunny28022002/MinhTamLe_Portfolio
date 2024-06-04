"use client";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import useHideOnAdd from "@/hooks/useHideOnAdd";
import {
  formatDate,
  hideFormAdsSyncFusion,
  hideLisenceElementSyncFusion,
} from "@/libs/common";
import {
  blogServiceAPI,
  headerConfig,
  userServiceAPI,
} from "@/libs/highmedicineapi";
import { Select, Spin, Toast } from "@douyinfe/semi-ui";
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";
import axios from "axios";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const AdminBlogUpdatePage = () => {
  const blogId = useParams().id;
  const [userInfo, setUserInfo] = useState({});
  const [editorValue, setEditorValue] = useState("");
  const targetElementRef = useHideOnAdd();
  let [users, setUsers] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const router = useRouter();
  let toast = {
    content: "",
    duration: 3,
  };
  const handleValueChange = (args) => {
    setEditorValue(args.value);
    formik.setFieldValue("content", args.value);
  };

  const formik = useFormik({
    initialValues: {
      blogId: blogId,
      title: "",
      content: "",
      isDraft: true,
    },

    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      isDraft: Yup.string().required("Is draft is required"),
      content: Yup.string().required("Content is required"),
    }),

    onSubmit: (values) => {
      setSpinner(true);
      console.log(values);
      axios
        .put(`${blogServiceAPI}/Blogs/Update`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Update successfull: ", response);
          toast.content = response.data.message;
          Toast.success(toast);
          router.push("/admin/blog/list");
        })
        .catch((error) => {
          console.log("An error occurred:", error.response);
          toast.content = error.response;
          Toast.error(toast);
          window.location.reload();
          setSpinner(false);
        })
        .finally(() => {
          // Call hideFormAdsSyncFusion() after the update is completed
          hideFormAdsSyncFusion();
        });
    },
  });

  useEffect(() => {
    hideLisenceElementSyncFusion();
    hideFormAdsSyncFusion();

    axios
      .get(`${userServiceAPI}/Authentication/Users`, {
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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${blogServiceAPI}/Blogs/id?id=${blogId}`,
          {
            headers: headerConfig,
          }
        );

        console.log(response.data);
        setUserInfo(response.data.data);
        formik.setFieldValue("title", response.data.data.title);
        formik.setFieldValue("isDraft", response.data.data.isDraft);
        setEditorValue(response.data.data.content);
        setSpinner(false);
      } catch (error) {
        console.log("An error occurred:", error.response);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {spinner ? (
        <div className="flex mt-[20%] justify-center items-center gap-4">
          <Spin aria-label="Spinner button example" />
        </div>
      ) : (
        <div className="flex flex-col my-7 items-center w-full">
          <HeaderAdminManagementComponent content={"Update Blog"} />
          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Title
              </p>
              <input
                type="text"
                placeholder="Enter your Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                name="title"
                id="title"
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.title}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                isDraft
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("isDraft", value)}
                onBlur={formik.handleBlur}
                value={formik.values.isDraft}
                name="isDraft"
                id="isDraft"
                placeholder="Select isDraft"
                style={{
                  width: "100%",
                  border: "1px solid",
                  borderRadius: "0.375rem",
                  outline: "none",
                  borderColor: "#D1D5DB",
                  backgroundColor: "#DEE4FF",
                  height: "42px",
                  fontWeight: "600",
                  marginTop: "-2px",
                }}
              >
                <Select.Option value={true}>True</Select.Option>
                <Select.Option value={false}>False</Select.Option>
              </Select>
              {formik.touched.isDraft && formik.errors.isDraft ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.isDraft}
                </div>
              ) : null}
            </div>

            <div className="col-span-2">
              <RichTextEditorComponent
                id="content"
                name="content"
                value={editorValue}
                change={handleValueChange}
              >
                <Inject
                  services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]}
                />
              </RichTextEditorComponent>
            </div>

            <div className="space-x-10 mt-5">
              <button
                type="submit"
                style={{
                  width: "33.33%",
                  height: "3rem",
                  backgroundColor: "#4361EE",
                  color: "#FFFFFF",
                  borderRadius: ".75rem",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                }}
                className="hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AdminBlogUpdatePage;
