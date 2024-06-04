"use client";
import React, { useState } from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import { headerConfig, medicineServiceAPI } from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
const CreateMedicineCodeClientPage = () => {
  const [spinner, setSpinner] = useState(false);
  const router = useRouter();
  let toast = {
    content: "",
    duration: 3,
  };

  const formik = useFormik({
    initialValues: {
      codeName: "",
    },
    validationSchema: Yup.object({
      codeName: Yup.string()
        .required("Code Name is required")
        .matches(
          /^[\p{L}0-9\s]*$/u,
          "Code name cannot contain special characters"
        ),
    }),
    
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .post(`${medicineServiceAPI}/MedicineCode/Create`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Create successfull: ", response.data.message);
          toast.content = response.data.message;
          Toast.success(toast);
          router.push("/client/medicineCode/list");
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
          <HeaderAdminManagementComponent content={"Create Medicine Code"} />
          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Code Name
              </p>
              <input
                type="text"
                placeholder="Enter Code Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.codeName}
                name="codeName"
                id="codeName"
              />
              {formik.touched.codeName && formik.errors.codeName ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.codeName}
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
                Create
              </button>
              <Link href="/client/medicineCode/list">
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

export default CreateMedicineCodeClientPage;
