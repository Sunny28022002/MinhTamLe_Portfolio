"use client";
import React from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  adminRole,
  headerConfig,
  userServiceAPI,
} from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { Select } from "@douyinfe/semi-ui";
import { formatDate } from "@/libs/common";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";

const UpdateStudentPage = () => {
  const userId = useParams().id;
  const router = useRouter();
  const [spinner, setSpinner] = useState(true);
  const [data, setData] = useState([]);

  const years = Array.from(
    { length: new Date().getFullYear() - 2006 + 1 },
    (_, i) => 2006 + i
  );

  let toast = {
    content: "",
    duration: 3,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${userServiceAPI}/Authentication/id?id=${userId}`,
          {
            headers: headerConfig,
          }
        );
        setData(response.data.data);
        formik.setFieldValue("username", response.data.data.username);
        formik.setFieldValue("firstName", response.data.data.firstName);
        formik.setFieldValue("lastName", response.data.data.lastName);
        formik.setFieldValue("experience", response.data.data.experience);
        formik.setFieldValue("gender", response.data.data.gender);
        //formik.setFieldValue("course", response.data.data.course);
        formik.setFieldValue(
          "startYear",
          response.data.data.course.split(" - ")[0]
        );
        formik.setFieldValue(
          "endYear",
          response.data.data.course.split(" - ")[1]
        );
        formik.setFieldValue("studentCode", response.data.data.studentCode);
        formik.setFieldValue("major", response.data.data.major);
        formik.setFieldValue(
          "birthday",
          formatDate(response.data.data.birthday)
        );
        formik.setFieldValue("phoneNumber", response.data.data.phoneNumber);
        formik.setFieldValue("university", response.data.data.university);
        setSpinner(false);
      } catch (error) {
        console.log("An error occurred:", error.response);
        setSpinner(false);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      userId: userId,
      roleId: 2,
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      experience: "",
      gender: "",
      major: "",
      qualification: "",
      workPlace: "",
      birthday: "",
      emergencyContact: "",
      phoneNumber: "",
      address: "",
      studentCode: "",
      course: "",
      university: "",
      IsActive: true,
      startYear: "",
      endYear: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("User Name is required"),
      studentCode: Yup.string().required("Student Code is required"),
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      gender: Yup.string().required("Gender is required"),
      //course: Yup.string().required("Course is required"),
      startYear: Yup.string().required("Start Year is required"),
      endYear: Yup.string().required("End Year is required"),
      birthday: Yup.string().required("Date Of Birth is required"),
      phoneNumber: Yup.string().required("Phone Number is required"),
      major: Yup.string().required("Major is required"),
      university: Yup.string().required("University is required"),
    }),
    onSubmit: (values) => {
      values.course = `${values.startYear} - ${values.endYear}`;
      setSpinner(true);
      axios
        .put(`${userServiceAPI}/Authentication/Update`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Update successfull: ", response);
          toast.content = response.data.message;
          Toast.success(toast);
          router.push("/admin/student/list");
        })
        .catch((error) => {
          console.log("An error occurred:", error.response.data.message);
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
          {/* -------- Title -------- */}
          <HeaderAdminManagementComponent content={"Update student"} />
          {/* Form */}
          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                User Name
              </p>
              <input
                type="text"
                placeholder="Enter your User Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                name="username"
                id="username"
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.username}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                University
              </p>
              <input
                type="text"
                placeholder="Enter your University"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.university}
                name="university"
                id="university"
              />
              {formik.touched.university && formik.errors.university ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.university}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                First Name
              </p>
              <input
                type="text"
                placeholder="Enter your First Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                name="firstName"
                id="firstName"
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.firstName}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Last Name
              </p>
              <input
                type="text"
                placeholder="Enter your Last Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                name="lastName"
                id="lastName"
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.lastName}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Start Year
              </p>
              <select
                value={formik.values.startYear}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ backgroundColor: "#DEE4FF" }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                name="startYear"
                id="startYear"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {formik.touched.startYear && formik.errors.startYear ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.startYear}
                </div>
              ) : null}
            </div>
            <div className="col-span-1 hidden">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Course
              </p>
              <input
                type="text"
                placeholder="Enter your Course"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.course}
                name="course"
                id="course"
              />
              {formik.touched.course && formik.errors.course ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.course}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                End Year
              </p>
              <select
                value={formik.values.endYear}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ backgroundColor: "#DEE4FF" }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                name="endYear"
                id="endYear"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {formik.touched.endYear && formik.errors.endYear ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.endYear}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Student Code
              </p>
              <input
                type="text"
                placeholder="Enter your Student Code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.studentCode}
                name="studentCode"
                id="studentCode"
              />
              {formik.touched.studentCode && formik.errors.studentCode ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.studentCode}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Gender
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("gender", value)}
                onBlur={formik.handleBlur}
                value={formik.values.gender}
                name="gender"
                id="gender"
                placeholder="Select Gender"
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
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
              </Select>
              {formik.touched.gender && formik.errors.gender ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.gender}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Major
              </p>
              <input
                type="text"
                placeholder="Enter your Major"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.major}
                name="major"
                id="major"
              />
              {formik.touched.major && formik.errors.major ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.major}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Phone Number
              </p>
              <input
                type="text"
                placeholder="Enter your Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
                name="phoneNumber"
                id="phoneNumber"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.phoneNumber}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Date of Birth
              </p>
              <input
                type="date"
                placeholder="Enter your Birthday"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.birthday}
                name="birthday"
                id="birthday"
              />
              {formik.touched.birthday && formik.errors.birthday ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.birthday}
                </div>
              ) : null}
            </div>
            <div></div>
            <div className="space-x-10 mt-5">
              <button
                type="submit"
                style={{
                  width: "33.33%",
                  height: "48px",
                  backgroundColor: "#4361EE",
                  color: "#FFFFFF",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                }}
                className="hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Update
              </button>
              <Link href="/admin/student/list">
                <button
                  type="button"
                  style={{
                    width: "33.33%",
                    height: "48px",
                    backgroundColor: "#F1F3F5",
                    color: "#495057",
                    borderRadius: "12px",
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

export default withAuth(UpdateStudentPage, adminRole);
