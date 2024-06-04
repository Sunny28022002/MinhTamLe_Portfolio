"use client";
import React from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { adminRole, headerConfig, userServiceAPI } from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { Select } from "@douyinfe/semi-ui";
import { formatDate } from "@/libs/common";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";

const UpdateStaffPage = () => {
  const userId = useParams().id;
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({});
  const [spinner, setSpinner] = useState(true);
  const [roles, setRoles] = useState(null);
  const validatePhoneNumber = (value) => {
    const phoneRegex = /^[0-9]{11}$/;
    const isNumericString = /^\d+$/.test(value);
    return isNumericString && phoneRegex.test(value)
      ? undefined
      : "Invalid phone number";
  };
  // toast
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

        console.log(response.data);
        setUserInfo(response.data.data);
        formik.setFieldValue("username", response.data.data.username);
        formik.setFieldValue("password", response.data.data.password);
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
        formik.setFieldValue("roleName", response.data.data.roleName);
        formik.setFieldValue("phoneNumber", response.data.data.phoneNumber);
        formik.setFieldValue("address", response.data.data.address);
        formik.setFieldValue("roleId", response.data.data.roleId);
        setSpinner(false)
      } catch (error) {
        // Handle error.
        console.log("An error occurred:", error.response);
      }
    };

    const getRoleStaff = async () => {
      try {
        const response = await axios.get(`${userServiceAPI}/Role/Staff`, {
          headers: headerConfig,
        });
        console.log(response.data);
        setRoles(response.data.data);
      } catch (error) {
        // Handle error.
        console.log("An error occurred:", error.response);
      }
    };


    fetchData();
    getRoleStaff();
  }, []);

  const formik = useFormik({
    initialValues: {
      userId: userId,
      roleId: "",
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
      roleName: "",
      phoneNumber: "",
      address: "",
      isActive: true,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      username: Yup.string().required("User Name is required"),
      address: Yup.string().required("Address is required"),
      experience: Yup.string().required("Experience is required"),
      gender: Yup.string().required("Gender is required"),
      major: Yup.string().required("Major is required"),
      qualification: Yup.string().required("Qualification is required"),
      workPlace: Yup.string().required("Workplace is required"),
      birthday: Yup.string().required("Date Of Birth is required"),
      phoneNumber: Yup.string()
        .max(11, "Phone Number must not be longer than 11 characters")
        .matches(
          /^0\d{9,10}$/,
          "Phone Number must only contain digits and must be in the format: 0xxxxxxxxx"
        )
        .required("Phone number is required"),
      //roleId: Yup.string().required("Role ID is required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      if(values.roleName == 3) {
        values.roleId = 3
      } else if (values.roleName == 4) {
        values.roleId = 4
      }
      console.log(values);
      axios
        .put(`${userServiceAPI}/Authentication/Update`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Update successfull: ", response);
          toast.content = response.data.message;
          Toast.success(toast);
          router.push("/admin/staff/list");
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
          <HeaderAdminManagementComponent content={"Update Staff"} />
          {/* Form */}
          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                First Name
              </p>
              <input
                type="text"
                placeholder="Enter your Last Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                name="firstName"
                id="firstName"
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-xs text-red-600 dark:text-red-400">
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
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.lastName}
                </div>
              ) : null}
            </div>
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
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.username}
                </div>
              ) : null}
            </div>
            <div className="col-span-1 hidden">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Password
              </p>
              <input
                type="text"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                name="password"
                id="password"
              />
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
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.major}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Experience
              </p>
              <input
                type="text"
                placeholder="Enter your Experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.experience}
                name="experience"
                id="experience"
              />
              {formik.touched.experience && formik.errors.experience ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.experience}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Qualification
              </p>
              <input
                type="text"
                placeholder="Enter your Qualification"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.qualification}
                name="qualification"
                id="qualification"
              />
              {formik.touched.qualification && formik.errors.qualification ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.qualification}
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
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Permission
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("roleName", value)}
                onBlur={formik.handleBlur}
                value={formik.values.roleName}
                name="roleName"
                id="roleName"
                placeholder="Select Role Name"
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
                {roles?.map((role, idx) => (
                  <Select.Option key={idx} value={role?.roleId}>
                    {role?.roleName}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="col-span-1 hidden">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Role ID
              </p>
              <input
                type="text"
                placeholder="Enter your roleId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.roleId}
                name="roleId"
                id="roleId"
              />
              {formik.touched.roleId && formik.errors.roleId ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.roleId}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Workplace
              </p>
              <input
                type="text"
                placeholder="Enter your Workplace"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.workPlace}
                name="workPlace"
                id="workPlace"
              />
              {formik.touched.workPlace && formik.errors.workPlace ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.workPlace}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Address
              </p>
              <input
                type="text"
                placeholder="Enter your address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                name="address"
                id="address"
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.address}
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
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.phoneNumber}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Birthday
              </p>
              <input
                type="date"
                placeholder="Enter your Date Of Birth"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.birthday}
                name="birthday"
                id="birthday"
              />
              {formik.touched.birthday && formik.errors.birthday ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.birthday}
                </div>
              ) : null}
            </div>
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
              <Link href="/admin/staff/list">
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

export default withAuth(UpdateStaffPage, adminRole);
