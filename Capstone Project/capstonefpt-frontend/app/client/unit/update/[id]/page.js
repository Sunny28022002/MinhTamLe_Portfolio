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
import { Select } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
const UpdateUnitClientPage = () => {
  const unitId = useParams().id;
  const router = useRouter();
  const [spinner, setSpinner] = useState(true);

  let toast = {
    content: "",
    duration: 3,
  };

  useEffect(() => {
    setSpinner(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${medicineServiceAPI}/Unit/id?id=${unitId}`,
          {
            headers: headerConfig,
          }
        );

        console.log(response.data);
        formik.setFieldValue("unitName", response.data.data.unitName);
        setSpinner(false);
      } catch (error) {
        setSpinner(false);
        console.log("An error occurred:", error.response);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      unitId: unitId,
      unitName: "",  
      isActive: true,
    },
    validationSchema: Yup.object({
      unitName: Yup.string().required("Unit Name is required"),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .put(`${medicineServiceAPI}/Unit/Update`, values, {
          headers: headerConfig,
        })
        .then((response) => {
          console.log("Update successfull: ", response);
          toast.content = response.data.message;
          Toast.success(toast);
          router.push("/client/unit/list");
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
          <HeaderAdminManagementComponent content={"Update Unit"} />
          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Unit Name
              </p>
              <input
                type="text"
                placeholder="Enter your Unit Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{ backgroundColor: "#DEE4FF" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.unitName}
                name="unitName"
                id="unitName"
              />
              {formik.touched.unitName && formik.errors.unitName ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.unitName}
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
              <Link href="/client/unit/list">
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

export default UpdateUnitClientPage;
