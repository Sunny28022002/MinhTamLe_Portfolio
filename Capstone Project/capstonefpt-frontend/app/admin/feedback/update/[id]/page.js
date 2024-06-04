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
  medicineServiceAPI,
  userServiceAPI,
} from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { Select } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import { Rating } from "@douyinfe/semi-ui";
import { IconLikeHeart } from "@douyinfe/semi-icons";
import { withAuth } from "@/contexts/withAuth";
import { AutoComplete, Avatar } from "@douyinfe/semi-ui";

const UpdateFeedbackPage = () => {
  const feedbackId = useParams().id;
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({});
  const [spinner, setSpinner] = useState(true);
  let [patients, setPatients] = useState(null);
  const [patientOptions, setPatientOptions] = useState([]);

  let toast = {
    content: "",
    duration: 3,
  };

  const searchPatientOptions = (value) => {
    let result;
    if (value) {
      result = patients.map((item) => {
        return { ...item, value: item.userId, label: item.username };
      });
    } else {
      result = [];
    }
    setPatientOptions(result);
  };

  const renderPatientOption = (item) => {
    return (
      <>
        <Avatar color={"indigo"} size="small">
          {item.userId}
        </Avatar>
        <div style={{ marginLeft: 4 }}>
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.username}</div>
        </div>
      </>
    );
  };

  const getPatientNameById = (arr, targetIndex) => {
    console.log(arr)
    console.log(targetIndex)
    let targetObject = arr.find((obj) => obj.userId === targetIndex);

    if (targetObject) {
      return targetObject.username;
    } else {
      return null;
    }
  };

  useEffect(() => {
    axios
      .get(`${userServiceAPI}/Authentication`, {
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${userServiceAPI}/Feedback/id?id=${feedbackId}`,
          {
            headers: headerConfig,
          }
        );

        console.log(response.data);
        setUserInfo(response.data.data);
        formik.setFieldValue("patientId", response.data.data.patientId);
        formik.setFieldValue("message", response.data.data.message);
        formik.setFieldValue("rating", response.data.data.rating);
        setSpinner(false);
      } catch (error) {
        console.log("An error occurred:", error.response);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      feedbackId: feedbackId,
      patientId: "",
      message: "",
      rating: 0,
    },
    validationSchema: Yup.object({
      patientId: Yup.string().required("Patient is required"),
      message: Yup.string().required("Message is required"),
      rating: Yup.string().required("Rating is required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .put(`${userServiceAPI}/Feedback/Update`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Update successfull: ", response);
          toast.content = response.data.message;
          Toast.success(toast);
          router.push("/admin/feedback/list");
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
          <HeaderAdminManagementComponent content={"Update Feedback"} />
          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Patient
              </p>
              <AutoComplete
                data={patientOptions}
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
                value={getPatientNameById(patients, formik.values.patientId)}
                name="patientId"
                id="patientId"
                className=""
                renderSelectedItem={(option) => option.patientName}
                renderItem={renderPatientOption}
                onSearch={searchPatientOptions}
                onSelect={(v) => formik.setFieldValue("patientId", v)}
              ></AutoComplete>
              {formik.touched.patientId && formik.errors.patientId ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.patientId}
                </div>
              ) : null}
            </div>
            <div className="col-span-1"></div>
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
            <div></div>
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
              <Link href="/admin/feedback/list">
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

export default withAuth(UpdateFeedbackPage, adminRole);
