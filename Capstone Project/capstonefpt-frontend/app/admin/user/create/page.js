"use client";
import React, { useEffect, useState } from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { adminRole, headerConfig, userServiceAPI } from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { Select } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";

const CreateUserAdminPage = () => {
  const [spinner, setSpinner] = useState(false);
  const router = useRouter();
  let [roles, setRoles] = useState(null);
  let toast = {
    content: "",
    duration: 3,
  };

  useEffect(() => {
    axios
      .get(`${userServiceAPI}/Role`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setRoles(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
  }, []);
  const validatePhoneNumber = (value) => {
    const phoneRegex = /^[0-9]{11}$/;
    const isNumericString = /^\d+$/.test(value);
    return isNumericString && phoneRegex.test(value)
      ? undefined
      : "Invalid phone number";
  };

  const formik = useFormik({
    initialValues: {
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
      phoneNumber: "",
      address: "",
      confirmpassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      username: Yup.string().required("User Name is required"),
      address: Yup.string().required("Address is required"),
      gender: Yup.string().required("Gender is required"),
      birthday: Yup.string().required("Date Of Birth is required"),
      gender: Yup.string().required("Gender is required"),
      phoneNumber: Yup.string()
        .required("Phone number is required")
        .test("validPhoneNumber", "Invalid phone number", validatePhoneNumber),
      roleId: Yup.string().required("Role Name is required"),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .post(`${userServiceAPI}/Authentication/Create`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Create successfull: ", response.data.message);
          toast.content = response.data.message;
          Toast.success(toast);
          router.push("/admin/user/list");
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
          {/* -------- Title -------- */}
          <HeaderAdminManagementComponent content={"Create User"} />
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
                Password
              </p>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                name="password"
                id="password"
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.password}
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
                Confirm Password
              </p>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                name="confirmPassword"
                id="confirmPassword"
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.confirmPassword}
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
                Permission
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("roleId", value)}
                onBlur={formik.handleBlur}
                value={formik.values.roleId}
                name="roleId"
                id="roleId"
                placeholder="Select Role"
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
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Date of Birth
              </p>
              <input
                type="date"
                placeholder="Enter your Date of Birth"
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
              {formik.touched.gender && formik.errors.gender ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.gender}
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
            <div className="space-x-10 mt-5">
              <button
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
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
                Create
              </button>
              <Link href="/admin/user/list">
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

export default withAuth(CreateUserAdminPage, adminRole);
