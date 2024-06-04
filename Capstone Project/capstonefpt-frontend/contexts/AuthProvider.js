"use client";
import { parseJwt } from "@/libs/common";
import {
  adminRole,
  headerConfig,
  userServiceAPI,
} from "@/libs/highmedicineapi";
import {
  AdminNavigation,
  DoctorNavigation,
  MedicalStaffNavigation,
  StaffNavigation,
  StudentNavigation,
  viewerNavigation,
} from "@/libs/setting";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { MdLogin } from "react-icons/md";
import {
  FaUsers,
  FaList,
  FaCalendarCheck,
  FaCalendarMinus,
} from "react-icons/fa";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuSetting, setMenuSetting] = useState([]);
  const [role, setRole] = useState("");
  const router = useRouter();
  const signInItem = {
    type: "item",
    itemKey: "signin",
    text: "Sign in",
    icon: <MdLogin className="text-xl" />,
    link: "/auth/signin",
  };

  const signUpItem = {
    type: "item",
    itemKey: "signup",
    text: "Sign up",
    icon: <IoIosPersonAdd className="text-xl" />,
    link: "/auth/signup",
  };

  const logoutItem = {
    type: "item",
    itemKey: "logout",
    text: "Logout",
    click: () => handleLogout(),
  };

  const doctorScheduleItem = {
    type: "sub",
    itemKey: "schedule",
    text: "Schedule",
    icon: <FaCalendarAlt className="w-6 p-0" />,
    items: [
      {
        type: "item",
        itemKey: "schedule-create",
        text: "Create",
        link: "/client/schedule/create",
        icon: <FaPlus className="w-6 p-0" />,
      },
    ],
  };

  const updateMenuSetting = (role) => {
    const userId = Cookies.get("userId");
    switch (role) {
      case "Admin":
        setMenuSetting([
          ...AdminNavigation,
          {
            type: "sub",
            itemKey: "patient",
            text: "Patient",
            icon: <FaUsers className="w-6 p-0" />,
            items: [
              {
                type: "item",
                itemKey: "patient-list",
                text: "List",
                link: "/admin/patient/list",
                icon: <FaList className="text-xs mt-1 ml-1" />,
              },
              // {
              //   type: "item",
              //   icon: <FaCalendarCheck className="text-xl" />,
              //   itemKey: "waiting-patient",
              //   text: "Waiting Schedule List",
              //   link: `/client/waitingSchedule/patient/${userId}`,
              // },
            ],
          },
          logoutItem,
        ]);
        break;
      case "Staff":
        setMenuSetting([...StaffNavigation, logoutItem]);
        break;
      case "Student":
        setMenuSetting([...StudentNavigation, logoutItem]);
        break;
      case "Medical Staff":
        setMenuSetting([...MedicalStaffNavigation, logoutItem]);
        break;
      case "Doctor":
        setMenuSetting([
          ...DoctorNavigation,
          {
            type: "sub",
            itemKey: "schedule",
            text: "Schedule",
            icon: <FaCalendarAlt className="w-6 p-0" />,
            items: [
              {
                type: "item",
                itemKey: "schedule-list",
                text: "List",
                link: "/client/schedule/list",
                icon: <FaList className="text-xs mt-1 ml-1" />,
              },
              {
                type: "item",
                itemKey: "schedule-create",
                text: "Create",
                link: "/client/schedule/create",
                icon: <FaPlus className="text-xs mt-1 ml-1" />,
              },
              {
                type: "item",
                itemKey: "waiting-schedule-doctor",
                text: "Waiting Schedule",
                link: `/client/waitingSchedule/doctor/${userId}`,
                icon: <FaCalendarCheck className="text-xs mt-1 ml-1" />,
              },
              {
                type: "item",
                itemKey: "empty-schedule",
                text: "Empty  Schedule",
                link: `/client/emptySchedule/${userId}`,
                icon: <FaCalendarMinus className="text-xs mt-1 ml-1" />,
              },
            ],
          },
          logoutItem,
        ]);
        break;
      default:
        setMenuSetting(viewerNavigation);
        break;
    }
  };

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get("token");
      const userId = Cookies.get("userId");
      setMenuSetting([...viewerNavigation, signInItem, signUpItem]);
      if (token) {
        headerConfig.Authorization = `Bearer ${token}`;
        await axios
          .get(`${userServiceAPI}/Authentication/id?id=${userId}`, {
            headers: headerConfig,
          })
          .then((response) => {
            setUser(response.data.data);
            const parsedToken = parseJwt(token);
            const roleFromToken = parsedToken?.role;
            // console.log("roleFromToken: ", roleFromToken);
            setRole(roleFromToken);
            updateMenuSetting(roleFromToken);
          })
          .catch((error) => {
            console.log("An error occurred:", error.response);
            if (error?.response?.status === 401) {
              // Unauthorized error, try refreshing token
              refreshToken().then((newToken) => {
                // console.log(
                //   "newToken.data.data.refreshToken: ",
                //   newToken.data.data.refreshToken
                // );
                // console.log(
                //   "newToken.data.data.accessToken: ",
                //   newToken.data.data.accessToken
                // );
                if (newToken) {
                  Cookies.set("token", newToken.data.data.accessToken);
                  Cookies.set("refreshToken", newToken.data.data.refreshToken);
                  loadUserFromCookies();
                } else {
                  handleLogout(); // If refresh fails, logout user
                }
              });
            }
          });
      }
      setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const handleLogin = (token, userId) => {
    headerConfig.Authorization = `Bearer ${token}`;
    axios
      .get(`${userServiceAPI}/Authentication/id?id=${userId}`, {
        headers: headerConfig,
      })
      .then((response) => {
        setUser(response.data.data);
        const parsedToken = parseJwt(token);
        const roleFromToken = parsedToken?.role;
        updateMenuSetting(roleFromToken);

        if (roleFromToken == adminRole) {
          router.push("/admin/home");
        } else {
          router.push("/");
        }
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    setUser(null);
    setMenuSetting([...viewerNavigation, signInItem, signUpItem]);
    router.push("/auth/signin");
  };

  const refreshToken = async () => {
    const refreshToken = Cookies.get("refreshToken");
    if (refreshToken) {
      try {
        const response = await axios.post(
          `${userServiceAPI}/Authentication/refreshToken?refreshToken=${refreshToken}`,
          {}
        );

        console.log(response);
        return response;
      } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
      }
    } else {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        menuSetting,
        handleLogin,
        handleLogout,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
