"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import React, { useState } from "react";
import VectorTop from "../../../public/staticImage/VectorsTop.png";
import VectorBottom from "../../../public/staticImage/VectorsBottom.png";
import { headerConfig, userServiceAPI } from "@/libs/highmedicineapi";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Spin, Toast } from "@douyinfe/semi-ui";
import { useAuth } from "@/contexts/AuthProvider";
import { BackgroundGradientAnimation } from "../../../components/animationBackground";
import Link from "next/link";

const SignInPage = () => {
  const [spinner, setSpinner] = useState(true);
  const router = useRouter();
  const { handleLogin } = useAuth();
  const [waiting, setWaiting] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(5, "Username must be at least 5 characters long")
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Username cannot contain special characters or spaces"
        )
        .required("Required"),
      password: Yup.string()
        .min(5, "Password must be at least 5 characters long")
        .required("Required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .post(`${userServiceAPI}/Authentication/login`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          // console.log("Login successful. Response:", response.data);
          let userId = response.data.data.userId;
          let token = response.data.data.accessToken;
          let refreshToken = response.data.data.refreshToken;
          headerConfig.Authorization = `Bearer ${token}`;
          Cookies.set("userId", userId, { expires: 1 });
          Cookies.set("token", token, { expires: 1 });
          Cookies.set("refreshToken", refreshToken, { expires: 1 });

          handleLogin(token, userId);
          // router.push("/");
        })
        .catch((error) => {
          // console.log("An error occurred:", error.response);
          let opts = {
            content: `${error?.response?.data?.message}`,
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
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-bg-neutral-4 relative z-10">
      <BackgroundGradientAnimation></BackgroundGradientAnimation>
      <form
        onSubmit={formik.handleSubmit}
        className="absolute left-463 top-298 w-1/4 h-100 p-8 bg-white rounded-md shadow-md mt-5"
      >
        <h2 className="text-4xl font-roboto font-bold text-center mb-6 text-bg-neutral-4">
          Sign In
        </h2>
        <p className="text-sm text-black-500 text-center mb-6">
          Sign in and start improving your health
        </p>
        <div className="mb-8">
          <input
            name="username"
            id="username"
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            style={{ backgroundColor: "#DEE4FF" }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-sm text-red-600 dark:text-red-400">
              {formik.errors.username}
            </div>
          ) : null}
        </div>
        <div className="mb-8">
          <input
            name="password"
            id="password"
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            style={{ backgroundColor: "#DEE4FF" }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-sm text-red-600 dark:text-red-400">
              {formik.errors.password}
            </div>
          ) : null}
        </div>

        {waiting ? (
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            type="submit"
          >
            <Spin size="middle" />
          </button>
        ) : (
          <button
            className="w-full bg-bg-neutral-4 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            type="submit"
          >
            Login
          </button>
        )}
        <div className="flex justify-between mt-6">
          <Link href={"/"}>
            <p className="flex items-center text-blue-500 hover:text-blue-800 hover:underline">
              Return Home
            </p>
          </Link>
          <Link href={"/auth/signup"}>
            <p className="flex items-center text-blue-500 hover:text-blue-800 hover:underline">
              Register
            </p>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
