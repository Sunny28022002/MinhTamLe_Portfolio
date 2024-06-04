"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { VChart } from "@visactor/react-vchart";
import {
  headerConfig,
  medicineServiceAPI,
  tempMedicineServiceAPI,
  tempUserServiceAPI,
  userServiceAPI,
  scheduleServiceAPI,
} from "@/libs/highmedicineapi";
import { Highlight, Spin } from "@douyinfe/semi-ui";
import HeaderAdminManagementComponent from "@/components/headerAdminManagement";

const StatisticAdminPage = () => {
  const [
    loadingExaminatedRecordStatistic,
    setLoadingExaminatedRecordStatistic,
  ] = useState(false);

  const [examinatedRecordStatistic, setExaminatedRecordStatistic] = useState(
    {}
  );
  const [totalActiveMedicine, setTotalActiveMedicine] = useState(0);
  const [loadingTotalActiveMedicine, setLoadingTotalActiveMedicine] =
    useState(false);
  const [totalInActiveMedicine, setTotalInActiveMedicine] = useState(0);
  const [loadingTotalInActiveMedicine, setLoadingTotalInActiveMedicine] =
    useState(false);
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [loadingTotalMedicines, setLoadingTotalMedicines] = useState(false);

  const [percentageMedicineCode, setPercentageMedicineCode] = useState({});
  const [loadingPercentageMedicineCode, setLoadingPercentageMedicineCode] =
    useState(false);

  const [survivalIndexStatistic, setSurvivalIndexStatistic] = useState({});
  const [loadingSurvivalIndexStatistic, setLoadingSurvivalIndexStatistic] =
    useState(false);

  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingTotalUsers, setLoadingTotalUsers] = useState(false);

  const [totalStudents, setTotalStudents] = useState(0);
  const [loadingTotalStudents, setLoadingTotalStudents] = useState(false);

  const [totalStaffs, setTotalStaffs] = useState(0);
  const [loadingTotalStaffs, setLoadingTotalStaffs] = useState(false);

  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loadingTotalDoctors, setLoadingTotalDoctors] = useState(false);

  const [statisticNumberUserByRole, setStatisticNumberUserByRole] = useState(
    {}
  );
  const [
    loadingStatisticNumberUserByRole,
    setLoadingStatisticNumberUserByRole,
  ] = useState(false);

  const [statisticPercentageUserByRole, setStatisticPercentageUserByRole] =
    useState({});
  const [
    loadingStatisticPercentageUserByRole,
    setLoadingStatisticPercentageUserByRole,
  ] = useState(false);

  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [loadingTotalFeedbacks, setLoadingTotalFeedbacks] = useState(false);

  const [totalSchedules, setTotalSchedules] = useState(0);
  const [loadingTotalSchedules, setLoadingTotalSchedules] = useState(false);

  const [totalSchedulesAccepted, setTotalSchedulesAccepted] = useState(0);
  const [loadingTotalSchedulesAccepted, setLoadingTotalSchedulesAccepted] =
    useState(false);

  const [
    loadingStatisticNumberScheduleByStatus,
    setLoadingStatisticNumberScheduleByStatus,
  ] = useState(false);

  const [statisticFeedbackOfDoctor, setStatisticFeedbackOfDoctor] = useState(
    {}
  );
  const [
    loadingStatisticFeedbackOfDoctor,
    setLoadingStatisticFeedbackOfDoctor,
  ] = useState(false);

  // For Medicine Statistics
  useEffect(() => {
    axios
      .get(`${medicineServiceAPI}/ExaminatedRecord/Statistic`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setExaminatedRecordStatistic({
          type: "bar",
          data: [
            {
              id: "examinatedRecordStatisticData",
              values: response.data.data,
            },
          ],
          title: {
            visible: true,
            text: "Statistics of medical records of doctors",
          },
          legends: {
            visible: true,
            orient: "left",
            title: {
              visible: true,
              text: "Elements",
            },
          },
          // label: {
          //   visible: true,
          // },
          xField: "doctorName",
          yField: "totalRecord",
        });
        setLoadingExaminatedRecordStatistic(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total active medicines
    axios
      .get(`${medicineServiceAPI}/Medicine/CountActiveMedicine`, {
        headers: headerConfig,
      })
      .then((response) => {
        // console.log(response.data);
        setTotalActiveMedicine(response.data.data);
        setLoadingTotalActiveMedicine(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total in-active medicines
    axios
      .get(`${medicineServiceAPI}/Medicine/CountInActiveMedicine`, {
        headers: headerConfig,
      })
      .then((response) => {
        // console.log(response.data.data);
        setTotalInActiveMedicine(response.data.data);
        setLoadingTotalInActiveMedicine(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total medicines
    axios
      .get(`${medicineServiceAPI}/Medicine`, {
        headers: headerConfig,
      })
      .then((response) => {
        // console.log(response);
        setTotalMedicines(response.data.totalDataList);
        setLoadingTotalMedicines(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For medicine statistic
    axios
      .get(`${medicineServiceAPI}/Medicine/Statistic`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        let processData = response.data.data;
        const modifiedData = processData.map((item) => ({
          codeName: item.codeName,
          average: item.average * 100,
        }));

        setPercentageMedicineCode({
          type: "pie",
          data: [
            {
              id: "percentageMedicineCodeStatistic",
              values: modifiedData,
            },
          ],
          outerRadius: 0.8,
          valueField: "average",
          categoryField: "codeName",
          title: {
            visible: true,
            text: "List drug groups by quantity statistics",
          },
          legends: {
            visible: true,
            orient: "left",
          },
          // label: {
          //   visible: true,
          // },
          tooltip: {
            mark: {
              content: [
                {
                  key: (datum) => datum["codeName"],
                  value: (datum) => datum["average"] + "%",
                },
              ],
            },
          },
        });
        setLoadingPercentageMedicineCode(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For medical rate statistic
    axios
      .get(`${medicineServiceAPI}/ExaminatedRecord/SurvivalRate`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data.data);
        setSurvivalIndexStatistic({
          type: "bar",
          data: [
            {
              id: "survivalIndexStatistic",
              values: response.data.data,
            },
          ],
          title: {
            visible: true,
            text: "List survival index statistics",
          },
          legends: {
            visible: true,
            orient: "left",
            title: {
              visible: true,
              text: "Measurement data from specialized equipment",
            },
          },
          // label: {
          //   visible: true,
          // },
          xField: "rateName",
          yField: "rateAverage",
        });
        setLoadingSurvivalIndexStatistic(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }, []);

  // For user statisics
  useEffect(() => {
    // For fetch total users
    axios
      .get(`${userServiceAPI}/Authentication/Users`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalUsers(response.data.totalDataList);
        setLoadingTotalUsers(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total student
    axios
      .get(`${userServiceAPI}/Authentication/Students`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalStudents(response.data.totalDataList);
        setLoadingTotalStudents(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total staffs
    axios
      .get(`${userServiceAPI}/Authentication/Staffs`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalStaffs(response.data.totalDataList);
        setLoadingTotalStaffs(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch total doctors
    axios
      .get(`${userServiceAPI}/Authentication/Doctors`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalDoctors(response.data.totalDataList);
        setLoadingTotalDoctors(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch statistic user by roles
    axios
      .get(`${userServiceAPI}/Authentication/StatisticRole`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        let barChart = {
          type: "bar",
          data: [
            {
              id: "numberUserbyRoles",
              values: response.data.data,
            },
          ],
          title: {
            visible: true,
            text: "Statistics of number user by roles",
          },
          legends: {
            visible: true,
            orient: "left",
            title: {
              visible: true,
              text: "Number of users",
            },
          },
          // label: {
          //   visible: true,
          // },
          xField: "roleName",
          yField: "numberOfUser",
        };

        let processData = response.data.data;
        const modifiedData = processData.map((item) => ({
          roleName: item.roleName,
          percentage: item.percentage * 100,
        }));

        let pieChart = {
          type: "pie",
          data: [
            {
              id: "percentageUserbyRoles",
              values: modifiedData,
            },
          ],
          outerRadius: 0.8,
          valueField: "percentage",
          categoryField: "roleName",
          title: {
            visible: true,
            text: "List users by roles statistics",
          },
          legends: {
            visible: true,
            orient: "left",
          },
          // label: {
          //   visible: true,
          // },
          tooltip: {
            mark: {
              content: [
                {
                  key: (datum) => datum["roleName"],
                  value: (datum) => datum["percentage"] + "%",
                },
              ],
            },
          },
        };
        setStatisticNumberUserByRole(barChart);
        setLoadingStatisticNumberUserByRole(true);

        setStatisticPercentageUserByRole(pieChart);
        setLoadingStatisticPercentageUserByRole(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }, []);

  // For Feedbacks statistic
  useEffect(() => {
    // For fetch all feedback
    axios
      .get(`${userServiceAPI}/Feedback`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalFeedbacks(response.data.totalDataList);
        setLoadingTotalFeedbacks(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    axios
      .get(`${userServiceAPI}/Feedback/StatisticFeedbackOfDoctor`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setStatisticFeedbackOfDoctor({
          type: "bar",
          data: [
            {
              id: "statisticFeedbackOfDoctor",
              values: response.data.data,
            },
          ],
          title: {
            visible: true,
            text: "List feedback of Doctor statistics",
          },
          xField: "doctorName",
          yField: ["avg"],
        });
        setLoadingStatisticFeedbackOfDoctor(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }, []);

  // For Schedules statistic
  useEffect(() => {
    // For fetch all Schedules
    axios
      .get(`${scheduleServiceAPI}/Schedule`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalSchedules(response.data.totalDataList);
        setLoadingTotalSchedules(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });

    // For fetch all Schedules Accepted
    axios
      .get(`http://localhost:5137/api/Schedule/GetAcceptSchedule`, {
        headers: headerConfig,
      })
      .then((response) => {
        console.log(response.data);
        setTotalSchedulesAccepted(response.data.totalDataList);
        setLoadingTotalSchedulesAccepted(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
    setLoadingStatisticNumberScheduleByStatus(true);
  }, []);

  return (
    <div className="flex flex-col my-7 items-center w-4/5">
      <HeaderAdminManagementComponent content={"Welcome to admin monitoring"} />

      {/* Users statistic */}
      <div className="mt-4">
        <h1 className="mb-4 text-2xl px-10 font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
          <span className="text-red-400">Users</span> Statistics Tracking
        </h1>
      </div>
      <div className="flex gap-4 justify-center items-center">
        {loadingTotalUsers ? (
          <div className="h-40 rounded-xl shadow-md p-6 bg-blue-400 min-w-[17rem]">
            <div className="font-semibold mb-1 text-lg">Total Users</div>
            <div className="font-semibold text-5xl tracking-tight">
              {totalUsers}
            </div>
            <div className="font-normal">Users</div>
          </div>
        ) : (
          <div className="h-40 rounded-xl shadow-md p-6 bg-blue-400 flex justify-center items-center">
            <Spin aria-label="Spinner button example" />
          </div>
        )}

        {loadingTotalStudents ? (
          <div className="h-40 rounded-xl shadow-md p-6 bg-red-400 min-w-[17rem]">
            <div className="font-semibold mb-1 text-lg">Total Students</div>
            <div className="font-semibold text-5xl tracking-tight">
              {totalStudents}
            </div>
            <div className="font-normal">Students</div>
          </div>
        ) : (
          <div className="h-40 rounded-xl shadow-md p-6 bg-red-400 flex justify-center items-center">
            <Spin aria-label="Spinner button example" />
          </div>
        )}

        {loadingTotalStaffs ? (
          <div className="h-40 rounded-xl shadow-md p-6 bg-green-400 min-w-[17rem]">
            <div className="font-semibold mb-1 text-lg">Total Staffs</div>
            <div className="font-semibold text-5xl tracking-tight">
              {totalStaffs}
            </div>
            <div className="font-normal">Staffs</div>
          </div>
        ) : (
          <div className="h-40 rounded-xl shadow-md p-6 bg-green-400 flex justify-center items-center">
            <Spin aria-label="Spinner button example" />
          </div>
        )}

        {loadingTotalDoctors ? (
          <div className="h-40 rounded-xl shadow-md p-6 bg-purple-400 min-w-[17rem]">
            <div className="font-semibold mb-1 text-lg">Total Doctors</div>
            <div className="font-semibold text-5xl tracking-tight">
              {totalDoctors}
            </div>
            <div className="font-normal">Doctors</div>
          </div>
        ) : (
          <div className="h-40 rounded-xl shadow-md p-6 bg-purple-400 flex justify-center items-center">
            <Spin aria-label="Spinner button example" />
          </div>
        )}
      </div>
      <div className="flex gap-4 justify-center items-center">
        {loadingStatisticNumberUserByRole ? (
          <VChart
            spec={{
              height: 400,
              ...statisticNumberUserByRole,
            }}
            option={{
              mode: "desktop-browser",
            }}
          />
        ) : (
          <div className="">
            <Spin aria-label="Spinner button example" />
          </div>
        )}

        {loadingStatisticPercentageUserByRole ? (
          <VChart
            spec={{
              height: 400,
              ...statisticPercentageUserByRole,
            }}
            option={{
              mode: "desktop-browser",
            }}
          />
        ) : (
          <div className="">
            <Spin aria-label="Spinner button example" />
          </div>
        )}
      </div>

      {/* Feedback statistic */}
      <div className="">
        <h1 className="mb-4 text-2xl px-10 font-extrabold text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Feedbacks
          </span>{" "}
          Statistics Tracking
        </h1>
      </div>

      <div className="flex flex-col gap-4 justify-center items-center">
        {loadingTotalFeedbacks ? (
          <div className="h-40 rounded-xl shadow-md p-6 bg-purple-400 min-w-[17rem]">
            <div className="font-semibold mb-1 text-lg">Total Feedbacks</div>
            <div className="font-semibold text-5xl tracking-tight">
              {totalFeedbacks}
            </div>
            <div className="font-normal">Feedbacks</div>
          </div>
        ) : (
          <div className="h-40 rounded-xl shadow-md p-6 bg-purple-400 flex justify-center items-center">
            <Spin aria-label="Spinner button example" />
          </div>
        )}

        <div className="min-w-[50rem]">
          {loadingStatisticFeedbackOfDoctor ? (
            <VChart
              spec={{
                height: 400,
                ...statisticFeedbackOfDoctor,
              }}
              option={{
                mode: "desktop-browser",
              }}
            />
          ) : (
            <div className="">
              <Spin aria-label="Spinner button example" />
            </div>
          )}
        </div>
      </div>

      {/* Schedule statistic */}
      <div className="mt-4">
        <h1 className="mb-4 text-2xl px-10 font-extrabold text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Schedules
          </span>{" "}
          Statistics Tracking
        </h1>
      </div>

      <div className="flex gap-4 justify-center items-center">
        {loadingStatisticNumberScheduleByStatus ? (
          <VChart
            spec={{
              height: 400,
              width: 900,
              type: "bar",
              data: [
                {
                  id: "numberSchedulebyStatus",
                  values: [
                    { status: "All", numberOfSchedule: totalSchedules },
                    {
                      status: "Accepted",
                      numberOfSchedule: totalSchedulesAccepted,
                    },
                  ],
                },
              ],
              title: {
                visible: true,
                text: "Statistics of schdule by status",
              },
              legends: {
                visible: true,
                orient: "top",
                title: {
                  visible: true,
                  text: "Number of Schedule",
                },
              },
              // label: {
              //   visible: true,
              // },
              xField: "status",
              yField: "numberOfSchedule",
            }}
            option={{
              mode: "desktop-browser",
            }}
          />
        ) : (
          <div className="">
            <Spin aria-label="Spinner button example" />
          </div>
        )}
      </div>

      {/* Medicine statistic */}
      <div className="mt-5">
        <h1 className="mb-4 text-2xl px-10 font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
          <span className="text-blue-400">Medicine</span> Statistics Tracking
        </h1>
      </div>

      <div className="flex gap-4 justify-center items-center">
        {loadingTotalActiveMedicine ? (
          <div className="h-40 rounded-xl shadow-md p-6 bg-blue-400 min-w-[17rem]">
            <div className="font-semibold mb-1 text-lg">
              Total Active Medicines
            </div>
            <div className="font-semibold text-5xl tracking-tight">
              {totalActiveMedicine}
            </div>
            <div className="font-normal">Medicines</div>
          </div>
        ) : (
          <div className="h-40 rounded-xl shadow-md p-6 bg-blue-400 flex justify-center items-center">
            <Spin aria-label="Spinner button example" />
          </div>
        )}

        {loadingTotalInActiveMedicine ? (
          <div className="h-40 rounded-xl shadow-md p-6 bg-red-400 min-w-[17rem]">
            <div className="font-semibold mb-1 text-lg">
              Total In-active Medicines
            </div>
            <div className="font-semibold text-5xl tracking-tight">
              {totalInActiveMedicine}
            </div>
            <div className="font-normal">Medicines</div>
          </div>
        ) : (
          <div className="h-40 rounded-xl shadow-md p-6 bg-red-400 flex justify-center items-center">
            <Spin aria-label="Spinner button example" />
          </div>
        )}

        {loadingTotalMedicines ? (
          <div className="h-40 rounded-xl shadow-md p-6 bg-green-400 min-w-[17rem]">
            <div className="font-semibold mb-1 text-lg">Total Medicines</div>
            <div className="font-semibold text-5xl tracking-tight">
              {totalMedicines}
            </div>
            <div className="font-normal">Medicines</div>
          </div>
        ) : (
          <div className="h-40 rounded-xl shadow-md p-6 bg-green-400 flex justify-center items-center">
            <Spin aria-label="Spinner button example" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="min-w-[50rem]">
          {loadingExaminatedRecordStatistic ? (
            <VChart
              spec={{
                height: 400,
                ...examinatedRecordStatistic,
              }}
              option={{
                mode: "desktop-browser",
              }}
            />
          ) : (
            <div className="">
              <Spin aria-label="Spinner button example" />
            </div>
          )}
        </div>
        <div className="min-w-[50rem]">
          {loadingSurvivalIndexStatistic ? (
            <>
              <VChart
                spec={{
                  height: 400,
                  ...survivalIndexStatistic,
                }}
                option={{
                  mode: "desktop-browser",
                }}
              />
            </>
          ) : (
            <>
              <div className="">
                <Spin aria-label="Spinner button example" />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center w-full">
        <div className="min-w-[50rem]">
          {loadingPercentageMedicineCode ? (
            <>
              <VChart
                spec={{
                  height: 400,
                  ...percentageMedicineCode,
                }}
                option={{
                  mode: "desktop-browser",
                }}
              />
            </>
          ) : (
            <>
              <div className="">
                <Spin aria-label="Spinner button example" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticAdminPage;
