"use client";
import React, { useState } from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  adminRole,
  headerConfig,
  userServiceAPI,
} from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { Select } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";
const CreateRolePage = () => {
  const [spinner, setSpinner] = useState(false);
  const router = useRouter();

  let toast = {
    content: "",
    duration: 3,
  };

  const formik = useFormik({
    initialValues: {
      roleName: "",
      user: "",
      blog: "",
      medicine: "",
      examinatedRecord: "",
      feedback: "",
      schedule: "",
      chat: "",
      isActive: "",
    },
    validationSchema: Yup.object({
      roleName: Yup.string()
        .required("Role Name is required")
        .matches(
          /^[a-zA-Z0-9\s]*$/,
          "Role names cannot contain special characters"
        ),
      user: Yup.string().required("Role for User management is required"),
      blog: Yup.string().required("Role for Blog management is required"),
      medicine: Yup.string().required(
        "Role for Medicine management is required"
      ),
      examinatedRecord: Yup.string().required(
        "Role for Examinated Record management is required"
      ),
      feedback: Yup.string().required(
        "Role for Feedback management is required"
      ),
      schedule: Yup.string().required(
        "Role for Schedule management is required"
      ),
      chat: Yup.string().required("Role for Chat management is required"),
      isActive: Yup.string().required("Status is required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .post(`${userServiceAPI}/Role/Create`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Create successfull: ", response.data);
          toast.content = response.data.message;
          if (response.data.status == 400) {
            Toast.error(toast);
            setSpinner(false);
          } else {
            Toast.success(toast);
            router.push("/admin/role/list");
          }
        })
        .catch((error) => {
          console.log("An error occurred:", error);
          toast.content = error.response.data.message;
          Toast.error(toast);
          setSpinner(false);
        });
    },
  });

  return (
    <>
      {spinner ? (
        <div className="flex w-full justify-center items-center gap-4">
          <Spin aria-label="Spinner button example" />
        </div>
      ) : (
        <div className="flex flex-col my-7 items-center w-full">
          <HeaderAdminManagementComponent content={"Create Role"} />
          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Role Name
              </p>
              <input
                type="text"
                placeholder="Enter new Role Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.roleName}
                name="roleName"
                id="roleName"
              />
              {formik.touched.roleName && formik.errors.roleName ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.roleName}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                User
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("user", value)}
                onBlur={formik.handleBlur}
                value={formik.values.user}
                name="user"
                id="user"
                placeholder="Select role for user management"
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
                <Select.Option value="ViewAndUpdate">
                  View And Update
                </Select.Option>
                <Select.Option value="Update">Update</Select.Option>
                <Select.Option value="Full Access">Full Access</Select.Option>
              </Select>
              {formik.touched.user && formik.errors.user ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.user}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Blog
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("blog", value)}
                onBlur={formik.handleBlur}
                value={formik.values.blog}
                name="blog"
                id="blog"
                placeholder="Select role for blog management"
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
                <Select.Option value="View">View</Select.Option>
                <Select.Option value="Full Access">Full Access</Select.Option>
              </Select>
              {formik.touched.blog && formik.errors.blog ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.blog}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Medicine
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("medicine", value)}
                onBlur={formik.handleBlur}
                value={formik.values.medicine}
                name="medicine"
                id="medicine"
                placeholder="Select role for medicine management"
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
                <Select.Option value="View">View</Select.Option>
                <Select.Option value="Full Access">Full Access</Select.Option>
              </Select>
              {formik.touched.medicine && formik.errors.medicine ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.medicine}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Examinated Record
              </p>
              <Select
                onChange={(value) =>
                  formik.setFieldValue("examinatedRecord", value)
                }
                onBlur={formik.handleBlur}
                value={formik.values.examinatedRecord}
                name="examinatedRecord"
                id="examinatedRecord"
                placeholder="Select role for Examinated Record management"
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
                <Select.Option value="View">View</Select.Option>
                <Select.Option value="Full Access">Full Access</Select.Option>
              </Select>
              {formik.touched.examinatedRecord &&
              formik.errors.examinatedRecord ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.examinatedRecord}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Feedback
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("feedback", value)}
                onBlur={formik.handleBlur}
                value={formik.values.feedback}
                name="feedback"
                id="feedback"
                placeholder="Select role for feedback management"
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
                <Select.Option value="View">View</Select.Option>
                <Select.Option value="Create">Create</Select.Option>
                <Select.Option value="Full Access">Full Access</Select.Option>
              </Select>
              {formik.touched.feedback && formik.errors.feedback ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.feedback}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Schedule
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("schedule", value)}
                onBlur={formik.handleBlur}
                value={formik.values.schedule}
                name="schedule"
                id="schedule"
                placeholder="Select role for schedule management"
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
                <Select.Option value="View">View</Select.Option>
                <Select.Option value="Modified Doctor">
                  Modified Doctor
                </Select.Option>
                <Select.Option value="Modified Patient">
                  Modified Patient
                </Select.Option>
                <Select.Option value="Full Access">Full Access</Select.Option>
              </Select>
              {formik.touched.schedule && formik.errors.schedule ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.schedule}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Chat
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("chat", value)}
                onBlur={formik.handleBlur}
                value={formik.values.chat}
                name="chat"
                id="chat"
                placeholder="Select role for chat management"
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
                <Select.Option value="Full Access">Full Access</Select.Option>
              </Select>
              {formik.touched.chat && formik.errors.chat ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.chat}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Status
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("isActive", value)}
                onBlur={formik.handleBlur}
                value={formik.values.isActive}
                name="isActive"
                id="isActive"
                placeholder="Select status"
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
                <Select.Option value="True">Active</Select.Option>
                <Select.Option value="False">Inactive</Select.Option>
              </Select>
              {formik.touched.isActive && formik.errors.isActive ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.isActive}
                </div>
              ) : null}
            </div>
            <div></div>
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
                Create
              </button>
              <Link href="/admin/role/list">
                <button
                  type="button"
                  style={{
                    width: "33.33%",
                    height: "3rem",
                    backgroundColor: "#F1F3F5",
                    color: "#495057",
                    borderRadius: ".75rem",
                    fontWeight: "bold",
                    transition: "all 0.3s",
                  }}
                  className="hover:bg-gray-400 hover:text-content-neutral-2 transition-all duration-300"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default withAuth(CreateRolePage, adminRole);
