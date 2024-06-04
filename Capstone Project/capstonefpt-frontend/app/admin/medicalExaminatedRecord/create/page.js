"use client";
import React, { useEffect, useState } from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { Form, useFormik } from "formik";
import * as Yup from "yup";
import {
  headerConfig,
  userServiceAPI,
  medicineServiceAPI,
  adminRole,
} from "@/libs/highmedicineapi";
import axios from "axios";
import Link from "next/link";
import { AutoComplete, Button, Select, TextArea } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { Toast, Spin } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";
import { withAuth } from "@/contexts/withAuth";
import Cookies from "js-cookie";

const CreateMedicalExaminatedRecordPage = () => {
  const [spinner, setSpinner] = useState(false);
  const router = useRouter();
  let [records, setRecords] = useState(null);
  let [medicines, setMedicines] = useState(null);
  const [medicineOptions, setMedicineOptions] = useState([]);
  let toast = {
    content: "",
    duration: 3,
  };
  let examinationRecordId = Cookies.get("examinationRecordId");

  useEffect(() => {
    axios
      .get(`${medicineServiceAPI}/ExaminatedRecord`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setRecords(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});

    axios
      .get(`${medicineServiceAPI}/Medicine`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setMedicines(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      })
      .finally(() => {});
  }, []);

  const formik = useFormik({
    initialValues: {
      recordId: examinationRecordId ? examinationRecordId : "",
      medicineCreatedLists: [
        { medicineId: "", quantity: 0, medicationGuide: "" },
      ],
    },
    validationSchema: Yup.object({
      recordId: Yup.string().required("Record ID is required"),

      medicineCreatedLists: Yup.array().of(
        Yup.object().shape({
          medicineId: Yup.string().required("Medicine ID is required"),
          quantity: Yup.number()
            .min(1, "Quantity must be greater than 0")
            .required("Quantity is required"),
          medicationGuide: Yup.string()
            .min(1, "Symptoms is required")
            .required("Symptoms is required"),
        })
      ),
    }),
    onSubmit: (values) => {
      setSpinner(true);
      axios
        .post(
          `${medicineServiceAPI}/MedicineExaminatedRecord/CreateList`,
          values,
          {
            headers: headerConfig,
          }
        )
        .then((response) => {
          console.log("Create successfull: ", response.data.message);
          toast.content = response.data.message;
          Toast.success(toast);
          Cookies.remove("examinationRecordId");
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

  const add = () => {
    const newEffect = { medicineId: "", quantity: 0 };
    formik.setFieldValue("medicineCreatedLists", [
      ...formik.values.medicineCreatedLists,
      newEffect,
    ]);
  };

  const remove = (index) => {
    const newEffects = [...formik.values.medicineCreatedLists];
    newEffects.splice(index, 1);
    formik.setFieldValue("medicineCreatedLists", newEffects);
  };

  const searchMedicineOptions = (value) => {
    let result;
    if (value) {
      result = medicines?.map((item) => {
        return { ...item, value: item.medicineId, label: item.medicineName };
      });
    } else {
      result = [];
    }
    setMedicineOptions(result);
  };

  const renderMedicineOption = (item) => {
    return (
      <>
        <div style={{ marginLeft: 4 }}>
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.medicineName}</div>
        </div>
      </>
    );
  };

  const renderItems = () => {
    return formik.values.medicineCreatedLists.map((effect, index) => (
      <div key={index} className="w-full flex flex-col gap-3">
        <div className="flex gap-3 w-full justify-between">
          <div className="flex flex-col w-full gap-3 min-h-full">
            <AutoComplete
              data={medicineOptions}
              className="w-full"
              renderSelectedItem={(option) => option.medicineName}
              placeholder="Enter medicine"
              renderItem={renderMedicineOption}
              onSearch={searchMedicineOptions}
              onSelect={(v) =>
                formik.setFieldValue(
                  `medicineCreatedLists[${index}].medicineId`,
                  v
                )
              }
            ></AutoComplete>

            {formik.touched.medicineCreatedLists &&
            formik.errors.medicineCreatedLists ? (
              <div className="text-xs text-red-600 dark:text-red-400">
                {formik.errors.medicineCreatedLists[index]?.medicineId}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 min-h-full">
            <input
              type="number"
              placeholder="Enter medicine quantity"
              className="px-3 border border-gray-300 text-sm rounded-md focus:outline-none focus:border-blue-500 h-9"
              onChange={(event) =>
                formik.setFieldValue(
                  `medicineCreatedLists[${index}].quantity`,
                  event.target.value
                )
              }
              value={formik.values.medicineCreatedLists[index].quantity}
            />

            {formik.touched.medicineCreatedLists &&
            formik.errors.medicineCreatedLists ? (
              <div className="text-xs text-red-600 dark:text-red-400">
                {formik.errors.medicineCreatedLists[index].quantity}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col w-full">
            <input
              type="string"
              placeholder="Enter medicine medicationGuide"
              className="px-3 border text-sm border-gray-300 rounded-md focus:outline-none focus:border-blue-500 h-9"
              onChange={(event) =>
                formik.setFieldValue(
                  `medicineCreatedLists[${index}].medicationGuide`,
                  event.target.value
                )
              }
              value={formik.values.medicineCreatedLists[index].medicationGuide}
            />
            {formik.touched.medicineCreatedLists &&
            formik.errors.medicineCreatedLists ? (
              <div className="text-xs text-red-600 dark:text-red-400">
                {formik.errors.medicineCreatedLists[index].medicationGuide}
              </div>
            ) : null}
          </div>

          <Button type="danger" onClick={() => remove(index)} className="">
            Remove
          </Button>
        </div>

        <div className="mb-4"></div>
      </div>
    ));
  };

  return (
    <SemiLocaleProvider locale={en_US}>
      {spinner ? (
        <div className="flex w-full justify-center items-center gap-4">
          <Spin aria-label="Spinner button example" />
        </div>
      ) : (
        <div className="flex flex-col my-7 items-center w-full">
          <HeaderAdminManagementComponent
            content={"Create Medical Examinated Record"}
          />

          <form
            className="grid grid-cols-2 mt-10 gap-5 w-5/6"
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-1">
              <p className="text-sm mb-2 font-semibold text-bg-neutral-4">
                Record Name
              </p>
              <Select
                onChange={(value) => formik.setFieldValue("recordId", value)}
                onBlur={formik.handleBlur}
                value={formik.values.recordId}
                name="recordId"
                id="recordId"
                placeholder="Select Record"
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
                {records?.map((record, idx) => (
                  <Select.Option key={idx} value={record?.recordId}>
                    {record?.recordId}
                  </Select.Option>
                ))}
              </Select>
              {formik.touched.recordId && formik.errors.recordId ? (
                <div className="text-xs text-red-600 dark:text-red-400">
                  {formik.errors.recordId}
                </div>
              ) : null}
            </div>
            <div></div>
            <div className="flex flex-col gap-3 justify-start items-start">
              <Button onClick={add}>Add medicine</Button>
              {renderItems()}
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
              <Link href="/admin/medicalExaminatedRecord/list">
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

export default withAuth(CreateMedicalExaminatedRecordPage, adminRole);
