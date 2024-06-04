"use client";
import React, { useEffect, useState } from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  headerConfig,
  userServiceAPI,
  medicineServiceAPI,
  adminRole,
} from "@/libs/highmedicineapi";
import { getUniqueRecords } from "@/libs/common";
import axios from "axios";
import Link from "next/link";
import { Select } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";
import { AutoComplete, Avatar } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";

const CreateExaminatedRecordPage = () => {
  const [spinner, setSpinner] = useState(false);
  const router = useRouter();
  let [doctors, setDoctors] = useState(null);
  const [doctorOptions, setDoctorOptions] = useState([]);
  let [patients, setPatients] = useState(null);
  const [patientOptions, setPatientOptions] = useState([]);

  let toast = {
    content: "",
    duration: 3,
  };

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
        console.log(response.data.data);
        setPatients(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
  }, []);

  const searchDoctorOptions = (value) => {
    let result;
    if (value) {
      result = doctors.map((item) => {
        return {
          ...item,
          value: item.userId,
          label: item.fullname,
        };
      });
    } else {
      result = [];
    }
    setDoctorOptions(result);
  };

  const renderDoctorOption = (item) => {
    return (
      <>
        <Avatar color={"indigo"} size="small">
          {item.userId}
        </Avatar>
        <div style={{ marginLeft: 4 }}>
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.fullname}</div>
        </div>
      </>
    );
  };

  const searchPatientOptions = (value) => {
    let result;
    if (value) {
      result = patients?.map((item) => {
        return {
          ...item,
          value: item.userId,
          label: item.fullname,
        };
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
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.fullname}</div>
        </div>
      </>
    );
  };

  const formik = useFormik({
    initialValues: {
      doctorId: "",
      patientId: "",
      respirationRate: 0,
      temperature: 0,
      bloodPressure: 0,
      spO2: 0,
      note: "",
      symptoms: "",
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
        .min(1, "Respiration must be greater than 0")
        .required("Respiration rate is required"),
      temperature: Yup.number()
        .min(1, "Temperature must be greater than 0")
        .required("Temperature is required"),
      bloodPressure: Yup.number()
        .min(1, "Blood pressure must be greater than 0")
        .required("Blood pressure is required"),
      spO2: Yup.number()
        .min(1, "SpO2 must be greater than 0")
        .required("SpO2 is required"),
      symptoms: Yup.string()
        .min(1, "Symptoms is required")
        .required("Symptoms is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      setSpinner(true);
      axios
        .post(`${medicineServiceAPI}/ExaminatedRecord`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          // console.log("Create successfull: ", response.data.message);
          // console.log("RecordId: ", response.data.data.recordId);
          toast.content = response.data.message;
          Toast.success(toast);
          Cookies.set("examinationRecordId", response.data.data.recordId, {
            expires: 1,
          });
          router.push("/admin/medicalExaminatedRecord/create");
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
          <HeaderAdminManagementComponent content={"Create Examined Record"} />
          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Doctor Name
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
                renderSelectedItem={(option) => option.fullname}
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
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Patient Name
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
                className=""
                renderSelectedItem={(option) => option.fullname}
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
                Create
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

export default withAuth(CreateExaminatedRecordPage, adminRole);
