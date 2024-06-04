"use client";
import React from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  headerConfig,
  userServiceAPI,
  scheduleServiceAPI,
  adminRole,
} from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { Select } from "@douyinfe/semi-ui";
import { formatDate } from "@/libs/common";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";

const UpdateScheduleAdminPage = () => {
  const scheduleId = useParams().id;
  const router = useRouter();
  const [spinner, setSpinner] = useState(true);

  let toast = {
    content: "",
    duration: 3,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${scheduleServiceAPI}/Schedule/id?id=${scheduleId}`,
          {
            headers: headerConfig,
          }
        );
        formik.setFieldValue("date", formatDate(response.data.data.date));
        formik.setFieldValue("startShift", response.data.data.startShift);
        formik.setFieldValue("endShift", response.data.data.endShift);
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
      scheduleId: scheduleId,
      date: "",
      startShift: "",
      endShift: "",
    },
    validationSchema: Yup.object({
      date: Yup.string().required("Date is required"),
      startShift: Yup.string().required("Start Shift is required"),
      endShift: Yup.string().required("End Shift is required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .put(`${scheduleServiceAPI}/Schedule/Update`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Update successfull: ", response);
          toast.content = response.data.message;
          Toast.success(toast);
          router.push("/admin/schedule/list");
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
        <div className="flex flex-col my-7 items-center w-full mt-2">
          {/* -------- Title -------- */}
          <HeaderAdminManagementComponent content={"Update schedule"} />
          {/* Form */}
          <form
            className="grid grid-cols-1 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1 w-[50%]">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Date
              </p>
              <input
                type="date"
                placeholder="Date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.date}
                name="date"
                id="date"
              />
              {formik.touched.date && formik.errors.date ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.date}
                </div>
              ) : null}
            </div>
            <div className="col-span-1 w-[50%]">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Start Shift
              </p>
              <input
                type="time"
                placeholder="Enter your start shift"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.startShift}
                name="startShift"
                id="startShift"
              />
              {formik.touched.startShift && formik.errors.startShift ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.startShift}
                </div>
              ) : null}
            </div>
            <div className="col-span-1 w-[50%]">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                End Shift
              </p>
              <input
                type="time"
                placeholder="Enter your start shift"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.endShift}
                name="endShift"
                id="endShift"
              />
              {formik.touched.endShift && formik.errors.endShift ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.endShift}
                </div>
              ) : null}
            </div>
            <div className="space-x-10 mt-5 w-[50%]">
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
              <Link href="/admin/schedule/list">
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

export default withAuth(UpdateScheduleAdminPage, adminRole);
