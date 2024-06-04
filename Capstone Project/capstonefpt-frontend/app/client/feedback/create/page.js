"use client";
import React, { useState, useEffect } from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { headerConfig, userServiceAPI } from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { AutoComplete, Avatar, Select } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import { Rating } from "@douyinfe/semi-ui";
import { IconLikeHeart } from "@douyinfe/semi-icons";
import Cookies from "js-cookie";

const CreateFeedbackClientPage = () => {
  const [spinner, setSpinner] = useState(false);
  const router = useRouter();
  let [patients, setPatients] = useState(null);

  const [userInfo, setUserInfo] = useState("");
  const userId = Cookies.get("userId");
  const color = ["amber", "indigo", "cyan"];
  let [doctors, setDoctors] = useState(null);
  const [doctorOptions, setDoctorOptions] = useState([]);
  let toast = {
    content: "",
    duration: 3,
  };
  const searchDoctorOptions = (value) => {
    let result;
    if (value) {
      result = doctors.map((item) => {
        return { ...item, value: item.userId, label: item.username };
      });
    } else {
      result = [];
    }
    setDoctorOptions(result);
  };

  const renderDoctorOption = (item) => {
    return (
      <>
        <Avatar color={'indigo'} size="small">
          {item.userId}
        </Avatar>
        <div style={{ marginLeft: 4 }}>
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.username}</div>
        </div>
      </>
    );
  };

  useEffect(() => {
    axios
      .get(`${userServiceAPI}/Authentication/Patients`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setPatients(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
    axios
      .get(`${userServiceAPI}/Authentication/Doctors`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setDoctors(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
  }, []);

  const formik = useFormik({
    initialValues: {
      doctorId: "",
      patientId: userId,
      message: "",
      rating: 0,
    },
    validationSchema: Yup.object({
      doctorId: Yup.string().required("Doctor is required"),
      message: Yup.string().required("Message is required"),
      rating: Yup.string().required("Rating is required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .post(`${userServiceAPI}/Feedback/Create`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Create successfull: ", response.data.message);
          toast.content = response.data.message;
          Toast.success(toast);
          router.push("/client/feedback/list");
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
          <HeaderAdminManagementComponent content={"Create Feedback"} />
          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Doctor
              </p>
              <AutoComplete
                data={doctorOptions}
                style={{
                  width: "100%",
                  border: "1px solid",
                  borderRadius: "0.375rem",
                  outline: "none",
                  borderColor: "#D1D5DB",
                  backgroundColor: "#DEE4FF",
                  height: "34px",
                  fontWeight: "600",
                  marginTop: "-2px",
                }}
                className=""
                renderSelectedItem={(option) => option.username}
                renderItem={renderDoctorOption}
                onSearch={searchDoctorOptions}
                onSelect={(v) => formik.setFieldValue("doctorId", v)}
              ></AutoComplete>
              {formik.touched.doctorId && formik.errors.doctorId ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.doctorId}
                </div>
              ) : null}
            </div>
            <div></div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Message
              </p>
              <input
                type="text"
                placeholder="Enter Your Message"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                name="message"
                id="message"
              />
              {formik.touched.message && formik.errors.message ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.message}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Rating
              </p>
              <Rating
                style={{ color: "red" }}
                size={48}
                allowHalf={false}
                character={<IconLikeHeart style={{ fontSize: 48 }} />}
                defaultValue={formik.values.rating}
                onChange={(value) => formik.setFieldValue("rating", value)}
              />
              {formik.touched.rating && formik.errors.rating ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.rating}
                </div>
              ) : null}
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
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateFeedbackClientPage;
