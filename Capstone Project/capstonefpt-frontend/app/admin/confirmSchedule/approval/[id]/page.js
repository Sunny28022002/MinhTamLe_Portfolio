"use client";
import React from "react";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  headerConfig,
  medicineServiceAPI,
  userServiceAPI,
  scheduleServiceAPI,
} from "@/libs/highmedicineapi";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Toast,
  Spin,
  Button,
  Card,
  Space,
  Avatar,
  Calendar,
  Tag,
  Tooltip,
} from "@douyinfe/semi-ui";
import { formatDate } from "@/libs/common";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider as SemiLocaleProvider } from "@douyinfe/semi-ui";

const ApprovalPage = () => {
  const scheduleId = useParams().id;
  const router = useRouter();
  const [spinner, setSpinner] = useState(true);
  const [scheduleData, setScheduleData] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const { Meta } = Card;
  const [displayValueInCalendar, setDisplayValueInCalendar] = useState("");

  let toast = {
    content: "",
    duration: 3,
  };

  const handleStartTime = (item) => {
    if (typeof item !== "object" || item === null) {
      return;
    }
    let date = item.date;
    let startShift = item.startShift;
    const [datePart] = date.split("T");
    const dateTimeString = datePart + "T" + startShift;
    return new Date(dateTimeString);
  };

  const handleEndTime = (item) => {
    if (typeof item !== "object" || item === null) {
      return;
    }
    let date = item.date;
    let endShift = item.endShift;
    const [datePart] = date.split("T");
    const dateTimeString = datePart + "T" + endShift;
    return new Date(dateTimeString);
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
        router.push("/admin/schedule/list");
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
        router.push("/admin/schedule/list");
        Toast.success(toast);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        toast.content = error.response.data.title;
        Toast.error(toast);
      });
  };

  const handleCancle = () => {
    router.push("/admin/schedule/list");
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
        setDisplayValueInCalendar(response.data.data.date);

        setSpinner(false);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        setSpinner(false);
      })
      .finally(() => {});
  }, []);

  const dateRender = (dateString) => {
    if (dateString === new Date(displayValueInCalendar).toString()) {
      return (
        <Tooltip
          content={`Meeting time: ${scheduleData?.startShift} - ${scheduleData?.endShift}`}
        >
          <div className="text-start w-full h-4/5 bg-blue-200 absolute rounded-lg p-4 border-solid border-2 border-bg-neutral-4">
            <p className="font-semibold">Metting time</p>
          </div>
        </Tooltip>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {spinner ? (
        <div className="flex mt-[20%] justify-center items-center gap-4">
          <Spin aria-label="Spinner button example" />
        </div>
      ) : (
        <SemiLocaleProvider locale={en_US}>
          <div className="flex flex-col my-7 items-center w-full">
            <HeaderAdminManagementComponent
              content={"Approval Schedule Page"}
            />
            <div className="flex gap-2 w-full justify-center items-center">
              <div className="flex flex-col w-4/12 justify-center items-center">
                <div className="flex items-center mt-8">
                  <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
                      Schedule Detail
                    </span>
                  </h1>
                </div>
                <Card
                  style={{
                    maxWidth: 400,
                    width: 364,
                    height: 364,
                    marginTop: 16,
                    marginRight: 16,
                  }}
                  title={
                    <Meta
                      title={`Doctor: ${
                        doctorDetails?.username
                          ? doctorDetails.username
                          : "Empty"
                      }`}
                      description={`Patient: ${
                        patientDetails?.username
                          ? patientDetails.username
                          : "Empty"
                      }`}
                      avatar={
                        <Avatar
                          alt="Card meta img"
                          size="default"
                          src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg"
                        />
                      }
                    />
                  }
                  footerLine={true}
                  footerStyle={{ display: "flex", justifyContent: "flex-end" }}
                  footer={
                    <Space>
                      <Button
                        className="font-sem"
                        onClick={handleAccept}
                        theme="borderless"
                        type="tertiary"
                        style={{
                          fontSize: 16,
                          color: "#15803d",
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={handleReject}
                        theme="borderless"
                        type="danger"
                        style={{
                          fontSize: 16,
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={handleCancle}
                        theme="borderless"
                        type="tertiary"
                        style={{
                          fontSize: 16,
                        }}
                      >
                        Cancel
                      </Button>
                    </Space>
                  }
                >
                  <div className="grid grid-cols-2">
                    <div>
                      <p>Dortor Name</p>
                      {doctorDetails ? (
                        <p className="font-semibold">{`${doctorDetails.username}`}</p>
                      ) : (
                        <p className="font-semibold">Empty</p>
                      )}
                    </div>
                    <div>
                      <p>Examinated Date</p>
                      {scheduleData ? (
                        <p className="font-semibold">
                          {formatDate(scheduleData.date)}
                        </p>
                      ) : (
                        <p className="font-semibold">Loading...</p>
                      )}
                    </div>
                    <div className="mt-2">
                      <p>Patient Name</p>
                      {patientDetails ? (
                        <p className="font-semibold">{`${patientDetails.username}`}</p>
                      ) : (
                        <p className="font-semibold">Empty</p>
                      )}
                    </div>
                    <div className="mt-2">
                      <p>Time</p>
                      {scheduleData ? (
                        <p className="font-semibold">
                          {scheduleData.startShift} - {scheduleData.endShift}
                        </p>
                      ) : (
                        <p className="font-semibold">Empty</p>
                      )}
                    </div>
                    <div className="mt-2">
                      <p>Status</p>
                      {scheduleData ? (
                        <p className="font-semibold">
                          {scheduleData.isAccepted ? "True" : "False"}
                        </p>
                      ) : (
                        <p className="font-semibold">Empty</p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
              <div className="flex flex-col w-8/12 justify-center items-center">
                <div className="flex items-center mt-8">
                  <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
                      Calendar
                    </span>
                  </h1>
                </div>
                <div className="w-[90%]">
                  <Calendar
                    height={700}
                    mode="month"
                    displayValue={new Date(scheduleData?.date)}
                    dateGridRender={dateRender}
                  />
                </div>
              </div>
            </div>
          </div>
        </SemiLocaleProvider>
      )}
    </>
  );
};

export default ApprovalPage;
