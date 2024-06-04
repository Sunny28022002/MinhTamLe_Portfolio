"use client";
import React from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { headerConfig, medicineServiceAPI } from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { AutoComplete, Select } from "@douyinfe/semi-ui";
import { formatDate } from "@/libs/common";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";

const UpdateMedicineClientPage = () => {
  const medicineId = useParams().id;
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({});
  const [spinner, setSpinner] = useState(true);
  let [units, setUnits] = useState(null);
  const [unitOptions, setUnitOptions] = useState([]);
  let [codes, setCodes] = useState(null);
  const [codeOptions, setCodeOptions] = useState([]);
  const searchUnitOptions = (value) => {
    let result;
    if (value) {
      result = units.map((item) => {
        return { ...item, value: item.unitId, label: item.unitName };
      });
    } else {
      result = [];
    }
    setUnitOptions(result);
  };

  const renderUnitOption = (item) => {
    return (
      <>
        <div style={{ marginLeft: 4 }}>
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.unitName}</div>
        </div>
      </>
    );
  };
  const searchCodeOptions = (value) => {
    let result;
    if (value) {
      result = codes.map((item) => {
        return { ...item, value: item.codeId, label: item.codeName };
      });
    } else {
      result = [];
    }
    setCodeOptions(result);
  };

  const renderCodeOption = (item) => {
    return (
      <>
        <div style={{ marginLeft: 4 }}>
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.codeName}</div>
        </div>
      </>
    );
  };

  let toast = {
    content: "",
    duration: 3,
  };
  useEffect(() => {
    axios
      .get(`${medicineServiceAPI}/Unit`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setUnits(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
  }, []);
  useEffect(() => {
    axios
      .get(`${medicineServiceAPI}/MedicineCode`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setCodes(response.data.data);
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
          `${medicineServiceAPI}/Medicine/id?id=${medicineId}`,
          {
            headers: headerConfig,
          }
        );

        console.log(response.data);
        setUserInfo(response.data.data);
        formik.setFieldValue("unitId", response.data.data.unitId);
        formik.setFieldValue("codeId", response.data.data.codeId);
        formik.setFieldValue("medicineName", response.data.data.medicineName);
        formik.setFieldValue("quantity", response.data.data.quantity);
        formik.setFieldValue("pricePerUnit", response.data.data.pricePerUnit);
        setSpinner(false);
      } catch (error) {
        console.log("An error occurred:", error.response);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      medicineId: medicineId,
      unitId: "",
      codeId: "",
      medicineName: "",
      quantity: "",
      pricePerUnit: "",
    },
    validationSchema: Yup.object({
      unitId: Yup.string().required("Unit ID is required"),
      codeId: Yup.string().required("Code ID is required"),
      medicineName: Yup.string().required("Medicine Name is required"),
      quantity: Yup.number()
        .typeError("Quantity must be a number")
        .min(1, "Quantity must be greater than 0")
        .required("Quantity is required"),
      pricePerUnit: Yup.number()
        .typeError("Price Per Unit must be a number")
        .min(1, "Price Per Unit must be greater than 0")
        .required("Price Per Unit is required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .put(`${medicineServiceAPI}/Medicine/Update`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Update successfull: ", response);
          toast.content = response.data.message;
          Toast.success(toast);
          router.push("/client/medicine/list");
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
          <HeaderAdminManagementComponent content={"Update Medicine"} />
          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Unit Name
              </p>
              <AutoComplete
                data={unitOptions}
                placeholder={"Enter Unit Name"}
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
                renderSelectedItem={(option) => option.unitName}
                renderItem={renderUnitOption}
                onSearch={searchUnitOptions}
                onSelect={(v) => formik.setFieldValue("unitId", v)}
              ></AutoComplete>
              {formik.touched.unitId && formik.errors.unitId ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.unitId}
                </div>
              ) : null}
            </div>
            <div></div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Price Per Unit
              </p>
              <input
                type="text"
                placeholder="Enter Price Per Unit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.pricePerUnit}
                name="pricePerUnit"
                id="pricePerUnit"
              />
              {formik.touched.pricePerUnit && formik.errors.pricePerUnit ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.pricePerUnit}
                </div>
              ) : null}
            </div>
            <div className="col-span-1">
              {/* <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Active
              </p>
              <Select
                placeholder="Select State"
                style={{
                  width: "100%",
                  border: ".0625rem solid",
                  borderRadius: "6px",
                  outline: "none",
                  borderColor: "#D1D5DB",
                  backgroundColor: "#DEE4FF",
                  height: "2.625rem",
                  fontWeight: "600",
                  marginTop: "-0.125rem",
                }}
                onChange={(value) => formik.setFieldValue("isActive", value)}
                onBlur={formik.handleBlur}
                value={formik.values.isActive}
                name="isActive"
                id="isActive"
              >
                <Select.Option value="True">True</Select.Option>
                <Select.Option value="False">False</Select.Option>
              </Select>
              {formik.touched.isActive && formik.errors.isActive ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.isActive}
                </div>
              ) : null} */}
            </div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Code Name
              </p>
              <AutoComplete
                data={codeOptions}
                placeholder={"Enter Code Name"}
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
                renderSelectedItem={(option) => option.codeName}
                renderItem={renderCodeOption}
                onSearch={searchCodeOptions}
                onSelect={(v) => formik.setFieldValue("codeId", v)}
              ></AutoComplete>
              {formik.touched.codeId && formik.errors.codeId ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.codeId}
                </div>
              ) : null}
            </div>
            <div></div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Medicine Name
              </p>
              <input
                type="text"
                placeholder="Enter Medicine Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.medicineName}
                name="medicineName"
                id="medicineName"
              />
              {formik.touched.medicineName && formik.errors.medicineName ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.medicineName}
                </div>
              ) : null}
            </div>
            <div></div>
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Quantity
              </p>
              <input
                type="text"
                placeholder="Enter Quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.quantity}
                name="quantity"
                id="quantity"
              />
              {formik.touched.quantity && formik.errors.quantity ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.quantity}
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
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UpdateMedicineClientPage;
