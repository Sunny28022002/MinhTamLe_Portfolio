"use client";
import React from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { headerConfig, userServiceAPI } from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { Select } from "@douyinfe/semi-ui";
import { formatDate } from "@/libs/common";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
const UserInfo = () => {
  const userId = Cookies.get("userId");
  const router = useRouter();
  const [spinner, setSpinner] = useState(true);

  let toast = {
    content: "",
    duration: 3,
  };

  useEffect(() => {
    setSpinner(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${userServiceAPI}/Authentication/id?id=${userId}`,
          {
            headers: headerConfig,
          }
        );

        console.log(response.data);
        formik.setFieldValue("username", response.data.data.username);
        formik.setFieldValue("firstName", response.data.data.firstName);
        formik.setFieldValue("lastName", response.data.data.lastName);
        formik.setFieldValue("experience", response.data.data.experience);
        formik.setFieldValue("gender", response.data.data.gender);
        formik.setFieldValue("major", response.data.data.major);
        formik.setFieldValue("qualification", response.data.data.qualification);
        formik.setFieldValue("workPlace", response.data.data.workPlace);
        formik.setFieldValue(
          "birthday",
          formatDate(response.data.data.birthday)
        );
        formik.setFieldValue(
          "emergencyContact",
          response.data.data.emergencyContact
        );
        formik.setFieldValue("phoneNumber", response.data.data.phoneNumber);
        formik.setFieldValue("address", response.data.data.address);
        formik.setFieldValue("roleId", response.data.data.roleId);
        setSpinner(false);
      } catch (error) {
        setSpinner(false);
        console.log("An error occurred:", error.response);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      userId: userId ? userId : "",
      roleId: "",
      firstName: "",
      lastName: "",
      username: "",
      experience: "",
      gender: "",
      major: "",
      qualification: "",
      workPlace: "",
      birthday: "",
      emergencyContact: "",
      phoneNumber: "",
      address: "",
      IsActive: true,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(5, "Username must be at least 5 characters long")
        .required("User Name is required"),
      firstName: Yup.string()
        .matches(/^[A-Za-z]/, "First name can not contain special characters")
        .required("First Name is required"),
      lastName: Yup.string()
        .matches(/^[A-Za-z]/, "Last name can not contain special characters")
        .required("Last Name is required"),
      gender: Yup.string().required("Gender is required"),
      address: Yup.string().required("Address is required"),
      birthday: Yup.string().required("Date Of Birth is required"),
      phoneNumber: Yup.string()
        .max(11, "Phone Number must not be longer than 11 characters")
        .matches(
          /^0\d{9,10}$/,
          "Phone Number must only contain digits and must be in the format: 0xxxxxxxxx"
        )
        .required("Phone number is required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .put(`${userServiceAPI}/Authentication/Update`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Update successfull: ", response);
          toast.content = response.data.message;
          Toast.success(toast);
          router.push("/");
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
        <div className="flex mt-[20%] justify-center items-center gap-4">
          <Spin aria-label="Spinner button example" />
        </div>
      ) : (
        <div className="flex flex-col my-7 items-center w-full">
          <HeaderAdminManagementComponent content={"User detail information"} />
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
                Address
              </p>
              <input
                type="text"
                placeholder="Enter your Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                name="address"
                id="address"
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.address}
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
            <div></div>
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
            <div className="col-span-1"></div>
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
            <div className="col-span-1"></div>
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
              <Link href="/">
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
                  Back To Home
                </button>
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UserInfo;
