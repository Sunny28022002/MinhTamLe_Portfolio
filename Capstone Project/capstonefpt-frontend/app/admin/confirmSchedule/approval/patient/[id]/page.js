"use client";
import React from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  headerConfig,
  medicineServiceAPI,
  userServiceAPI,
  scheduleServiceAPI,
} from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { Select } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import { formatDate } from "@/libs/common";

const ApprovalPage = () => {
  const scheduleId = useParams().id;
  const router = useRouter();
  const [spinner, setSpinner] = useState(true);
  const [scheduleData, setScheduleData] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  let toast = {
    content: "",
    duration: 3,
  };

  const handleAccept = () => {
    axios
      .put(
        `${scheduleServiceAPI}/Schedule/accept/id?id=${scheduleId}`,
        {},
        {
          headers: headerConfig,
        }
      )
      .then((response) => {
        console.log("Accept successful: ", response);
        toast.content = response.data.message;
        const patientId = scheduleData?.patientId;
        router.push(`/client/waitingSchedule/patient/${patientId}`);
        Toast.success(toast);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        Toast.error(toast);
      });
  };

  const handleReject = () => {
    axios
      .put(
        `${scheduleServiceAPI}/Schedule/reject/id?id=${scheduleId}`,
        {},
        {
          headers: headerConfig,
        }
      )
      .then((response) => {
        console.log("Reject successfull: ", response);
        toast.content = response.data.message;
        const patientId = scheduleData?.patientId;
        router.push(`/client/waitingSchedule/patient/${patientId}`);
        Toast.success(toast);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        toast.content = error.response.data.title;
        Toast.error(toast);
      });
  };

  const handleCancle = () => {
    const patientId = scheduleData?.patientId;
    router.push(`/client/waitingSchedule/patient/${patientId}`);
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `${userServiceAPI}/Authentication/id?id=${userId}`,
        {
          headers: headerConfig,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user details:", error.response);
      return null;
    }
  };
  useEffect(() => {
    if (scheduleData && scheduleData.doctorId) {
      fetchUserDetails(scheduleData.doctorId).then((doctorDetails) => {
        setDoctorDetails(doctorDetails);
      });
    }
    if (scheduleData && scheduleData.patientId) {
      fetchUserDetails(scheduleData.patientId).then((patientDetails) => {
        setPatientDetails(patientDetails);
      });
    }
  }, [scheduleData]);
  useEffect(() => {
    axios
      .get(`${scheduleServiceAPI}/Schedule/id?id=${scheduleId}`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setScheduleData(response.data.data);
        setSpinner(false);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        setSpinner(false);
      })
      .finally(() => {});
  }, []);
  return (
    <>
      {spinner ? (
        <div className="flex mt-[20%] justify-center items-center gap-4">
          <Spin aria-label="Spinner button example" />
        </div>
      ) : (
        <div className="flex flex-col my-7 items-center w-full">
          <HeaderAdminManagementComponent content={"Approval Schedule Page"} />
          <div className="grid grid-cols-2 mt-10 gap-5 w-5/6">
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Doctor Name
              </p>
              <div
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                style={{ backgroundColor: "#DEE4FF" }}
              >
                {doctorDetails ? (
                  <p>{`${doctorDetails.username}`}</p>
                ) : (
                  <p>Empty</p>
                )}
              </div>
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Examinated Date
              </p>
              <div
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                style={{ backgroundColor: "#DEE4FF" }}
              >
                {scheduleData ? (
                  <p>{formatDate(scheduleData.date)}</p>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Patient Name
              </p>
              <div
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                style={{ backgroundColor: "#DEE4FF" }}
              >
                {patientDetails ? (
                  <p>{`${patientDetails.username}`}</p>
                ) : (
                  <p>Empty</p>
                )}
              </div>
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Start Shift
              </p>
              <div
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                style={{ backgroundColor: "#DEE4FF" }}
              >
                {scheduleData ? <p>{scheduleData.startShift}</p> : <p>Empty</p>}
              </div>
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                IsAccepted
              </p>
              <div
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                style={{ backgroundColor: "#DEE4FF" }}
              >
                {scheduleData ? (
                  <p>{scheduleData.isAccepted ? "True" : "False"}</p>
                ) : (
                  <p>Empty</p>
                )}
              </div>
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                End Shift
              </p>
              <div
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                style={{ backgroundColor: "#DEE4FF" }}
              >
                {scheduleData ? <p>{scheduleData.endShift}</p> : <p>Empty</p>}
              </div>
            </div>
            <div className="space-x-10 mt-5">
              <button
                onClick={handleAccept}
                style={{
                  width: "25%",
                  height: "48px",
                  backgroundColor: "#4CAF50",
                  color: "#FFFFFF",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                }}
                className="hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                style={{
                  width: "25%",
                  height: "48px",
                  backgroundColor: "#FF5733",
                  color: "#FFFFFF",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                }}
                className="hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Reject
              </button>
                <button
                onClick={handleCancle}
                  type="button"
                  style={{
                    width: "25%",
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApprovalPage;
