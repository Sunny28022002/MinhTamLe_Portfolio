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
  medicineServiceAPI,
  adminRole,
} from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { Select } from "@douyinfe/semi-ui";
import { formatDate, getUniqueRecords } from "@/libs/common";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";
import Cookies from "js-cookie";

const UpdateExaminatedRecordPage = () => {
  const erid = useParams().id;
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({});
  const [spinner, setSpinner] = useState(true);
  const [doctors, setDoctors] = useState(null);
  const [patients, setPatients] = useState(null);

  useEffect(() => {
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

    axios
      .get(`${userServiceAPI}/Authentication/Patients`, {
        headers: headerConfig,
      })
      .then((response) => {
        const dataArr = response.data.data;
        const uniqueRecords = getUniqueRecords(dataArr, "userId");
        setPatients(uniqueRecords);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${medicineServiceAPI}/ExaminatedRecord/id?id=${erid}`,
          {
            headers: headerConfig,
          }
        );

        console.log(response.data);
        setUserInfo(response.data.data);
        formik.setFieldValue("recordId", response.data.data.recordId);
        formik.setFieldValue("doctorId", response.data.data.doctorId);
        formik.setFieldValue("patientId", response.data.data.patientId);
        formik.setFieldValue(
          "respirationRate",
          response.data.data.respirationRate
        );
        formik.setFieldValue("temperature", response.data.data.temperature);
        formik.setFieldValue("bloodPressure", response.data.data.bloodPressure);
        formik.setFieldValue("spO2", response.data.data.spO2);
        formik.setFieldValue("note", response.data.data.note);
        formik.setFieldValue("isActive", response.data.data.isActive);
        formik.setFieldValue("createdDate", response.data.data.createdDate);
        formik.setFieldValue("symptoms", response.data.data.symptoms);
        setSpinner(false);
      } catch (error) {
        console.log("An error occurred:", error.response);
      }
    };

    fetchData();
  }, []);

  let toast = {
    content: "",
    duration: 3,
  };

  const formik = useFormik({
    initialValues: {
      recordId: erid,
      doctorId: 0,
      patientId: 0,
      respirationRate: 0,
      temperature: 0,
      bloodPressure: 0,
      spO2: 0,
      note: "",
      symptoms: "",
      createdDate: new Date(),
      isActive: true,
    },
    validationSchema: Yup.object({
      doctorId: Yup.number()
        .min(1, "Doctor name is required")
        .required("Doctor name is required"),
      patientId: Yup.number()
        .min(1, "Patient name is required")
        .required("Patient name is required"),
      respirationRate: Yup.number()
        .min(1, "Respiration rate is required")
        .required("Respiration rate is required"),
      temperature: Yup.number()
        .min(1, "Temperature is required")
        .required("Temperature is required"),
      bloodPressure: Yup.number()
        .min(1, "Blood pressure is required")
        .required("Blood pressure is required"),
      spO2: Yup.number()
        .min(1, "SpO2 is required")
        .required("SpO2 is required"),
      symptoms: Yup.string()
        .min(1, "Symptoms is required")
        .required("Symptoms is required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .put(`${medicineServiceAPI}/ExaminatedRecord/Update`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Update successfull: ", response);
          toast.content = response.data.message;
          Toast.success(toast);
          Cookies.set("examinationRecordId", response.data.data.recordId, {
            expires: 1,
          });
          router.push("/admin/medicalExaminatedRecord/list");
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
    <SemiLocaleProvider locale={en_US}>
      {spinner ? (
        <div className="flex w-full justify-center items-center gap-4">
          <Spin aria-label="Spinner button example" />
        </div>
      ) : (
        <div className="flex flex-col my-7 items-center w-full">
          <HeaderAdminManagementComponent
            content={"Update Examinated Record"}
          />
          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Doctor Name
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("doctorId", value)}
                onBlur={formik.handleBlur}
                value={formik.values.doctorId}
                name="doctorId"
                id="doctorId"
                placeholder="Select Doctor"
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
                {doctors?.map((doctor, idx) => (
                  <Select.Option key={idx} value={doctor?.userId}>
                    {doctor?.username}
                  </Select.Option>
                ))}
              </Select>
              {formik.touched.doctorId && formik.errors.doctorId ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.doctorId}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Patient Name
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("patientId", value)}
                onBlur={formik.handleBlur}
                value={formik.values.patientId}
                name="patientId"
                id="patientId"
                placeholder="Select patient"
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
                {patients?.map((patient, idx) => (
                  <Select.Option key={idx} value={patient?.userId}>
                    {patient?.username}
                  </Select.Option>
                ))}
              </Select>
              {formik.touched.patientId && formik.errors.patientId ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.patientId}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Respiration Rate
              </p>
              <input
                type="number"
                placeholder="Enter Respiration Rate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.respirationRate}
                name="respirationRate"
                id="respirationRate"
                min={0}
              />
              {formik.touched.respirationRate &&
              formik.errors.respirationRate ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.respirationRate}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Temperature
              </p>
              <input
                type="number"
                placeholder="Enter Temperature"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.temperature}
                name="temperature"
                id="temperature"
                min={0}
              />
              {formik.touched.temperature && formik.errors.temperature ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.temperature}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Blood Pressure
              </p>
              <input
                type="number"
                placeholder="Enter Blood Pressure"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bloodPressure}
                name="bloodPressure"
                id="bloodPressure"
                min={0}
              />
              {formik.touched.bloodPressure && formik.errors.bloodPressure ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.bloodPressure}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                SpO2
              </p>
              <input
                type="number"
                placeholder="Enter SpO2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.spO2}
                name="spO2"
                id="spO2"
                min={0}
              />
              {formik.touched.spO2 && formik.errors.spO2 ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.spO2}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Symptoms
              </p>
              <input
                type="text"
                placeholder="Enter symptoms"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.symptoms}
                name="symptoms"
                id="symptoms"
              />
              {formik.touched.symptoms && formik.errors.symptoms ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.symptoms}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Note
              </p>
              <input
                type="text"
                placeholder="Enter Note"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.note}
                name="note"
                id="note"
              />
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Created Date
              </p>
              <input
                type="text"
                placeholder="Enter Created Date"
                className="w-full px-3 py-2 border border-gray-300 bg-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formatDate(formik.values.createdDate)}
                name="Created Date"
                id="Created Date"
                disabled
              />
            </div>

            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Status
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("isActive", value)}
                onBlur={formik.handleBlur}
                value={formik.values.isActive}
                name="isActive"
                id="isActive"
                placeholder="Select Status"
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
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
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
              <Link href="/admin/examinatedRecord/list">
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
    </SemiLocaleProvider>
  );
};

export default withAuth(UpdateExaminatedRecordPage, adminRole);
