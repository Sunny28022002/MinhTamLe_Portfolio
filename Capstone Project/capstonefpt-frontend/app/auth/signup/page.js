"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import VectorTop from "../../../public/staticImage/VectorsTop.png";
import VectorBottom from "../../../public/staticImage/VectorsBottom.png";
import { headerConfig, userServiceAPI } from "@/libs/highmedicineapi";
import axios from "axios";
import { Spin, Toast } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { BackgroundGradientAnimation } from "@/components/animationBackground";

const SignUpPage = () => {
  const router = useRouter();
  const { handleLogin } = useAuth();
  const [waiting, setWaiting] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      phonenumber: "",
      username: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .matches(/^[A-Za-z]/, "First name can not contain special characters")
        .required("First Name is required"),
      lastname: Yup.string()
        .matches(/^[A-Za-z]/, "Last name can not contain special characters")
        .required("Last Name is required"),
      phonenumber: Yup.string()
        .max(11, "Phone Number must not be longer than 11 characters")
        .matches(
          /^0\d{9,10}$/,
          "Phone Number must only contain digits and must be in the format: 0xxxxxxxxx"
        )
        .required("Phone Number is required"),
      username: Yup.string()
        .min(5, "Username must be at least 5 characters long")
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Username cannot contain special characters or spaces"
        )
        .required("Username is required"),
      password: Yup.string()
        .min(5, "Password must be at least 5 characters long")
        .required("Password is required"),
      confirmpassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      // console.log(values);
      setWaiting(true);
      axios
        .post(`${userServiceAPI}/Authentication/register`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          // console.log("Correct: ", response.data.data.accessToken);
          let userId = response.data.data.userId;
          let token = response.data.data.accessToken;
          headerConfig.Authorization = `Bearer ${token}`;
          Cookies.set("userId", userId, { expires: 1 });
          Cookies.set("token", token, { expires: 1 });
          handleLogin(token, userId);
          router.push("/");
        })
        .catch((error) => {
          console.log("An error occurred:", error.response);
          let errorMessage = error.response?.data?.message;
          let opts = {
            content: `${errorMessage}`,
            duration: 3,
          };
          Toast.error(opts);
        })
        .finally(() => {
          setWaiting(false);
        });
    },
  });

  return (
    <div className="flex w-screen h-screen">
      <div className="w-6/12 p-8 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-roboto font-bold text-center mb-6 text-bg-neutral-4">
          Sign Up
        </h1>
        <form
          onSubmit={formik.handleSubmit}
          className="w-4/5 flex flex-col justify-between mb-20"
        >
          <div className="mb-9">
            <p className="text-sm mb-2">First Name</p>
            <input
              type="text"
              placeholder="Enter your First Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              style={{ backgroundColor: "#DEE4FF" }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstname}
              name="firstname"
              id="firstname"
            />
            {formik.touched.firstname && formik.errors.firstname ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.firstname}
              </div>
            ) : null}
          </div>

          <div className="mb-9">
            <p className="text-sm mb-2">Last Name</p>
            <input
              type="text"
              placeholder="Enter your Last Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              style={{ backgroundColor: "#DEE4FF" }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastname}
              name="lastname"
              id="lastname"
            />
            {formik.touched.lastname && formik.errors.lastname ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.lastname}
              </div>
            ) : null}
          </div>

          <div className="mb-9">
            <p className="text-sm mb-2">Phone Number</p>
            <input
              type="tel"
              placeholder="Enter your Phone Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              style={{ backgroundColor: "#DEE4FF" }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phonenumber}
              name="phonenumber"
              id="phonenumber"
            />
            {formik.touched.phonenumber && formik.errors.phonenumber ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.phonenumber}
              </div>
            ) : null}
          </div>

          <div className="mb-9">
            <p className="text-sm mb-2">User Name</p>
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

          <div className="mb-9">
            <p className="text-sm mb-2">Password</p>
            <input
              type="password"
              placeholder="Enter your Password"
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

          <div className="mb-9">
            <p className="text-sm mb-2">Confirm Password</p>
            <input
              type="password"
              placeholder="Confirm Your Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              style={{ backgroundColor: "#DEE4FF" }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmpassword}
              name="confirmpassword"
              id="confirmpassword"
            />
            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.confirmpassword}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col justify-center items-center">
            {waiting ? (
              <button
                type="submit"
                className="w-full h-12 bg-bg-neutral-4 text-white rounded-lg font-bold"
              >
                <Spin size="middle" />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full h-12 bg-bg-neutral-4 text-white rounded-lg font-bold"
              >
                Register
              </button>
            )}

            <p className="mt-4">
              <span className="text-sm font-roboto">
                Already have an account?{" "}
              </span>
              <Link
                href="/auth/signin"
                className="text-sm font-bold text-bg-neutral-4"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
      <div className="w-6/12 flex flex-col justify-center items-center">
        <BackgroundGradientAnimation>
                        
        </BackgroundGradientAnimation>
      </div>
    </div>
  );
};

export default SignUpPage;
