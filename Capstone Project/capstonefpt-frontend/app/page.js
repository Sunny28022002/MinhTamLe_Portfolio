"use client";
import { Button } from "@douyinfe/semi-ui";
import { FaUserAlt, FaUserPlus } from "react-icons/fa";
import Image from "next/image";
import homePageImage1 from "../public/staticImage/homePageImage1.jpg";
import homePageImage2 from "../public/staticImage/homePageImage2.jpg";
import homePageImage3 from "../public/staticImage/homePageImage3.jpg";
import homePageImage4 from "../public/staticImage/homePageImage4.jpg";
import homePageImage6 from "../public/staticImage/homePageImageLogin2.jpg";
import Link from "next/link";
import { headerConfig, userServiceAPI } from "../libs/highmedicineapi";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState({});
  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get("token");
      const userId = Cookies.get("userId");
      if (token) {
        try {
          const response = await axios.get(
            `${userServiceAPI}/Authentication/id?id=${userId}`,
            {
              headers: headerConfig,
            }
          );
          setUser(response.data);
        } catch (error) {
          console.log("An error occurred:", error.response);
        }
      }
    }
    loadUserFromCookies();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 my-7 justify-items-center w-full">
        {/* -------- Title -------- */}
        <div className="bg-gray-100 w-5/6 text-center h-fit p-[18px] font-bold rounded-lg">
          <span className="text-2xl text-bg-neutral-4"> 
            School Health Counseling{" "}
          </span>
          <span className="text-2xl text-content-neutral-5">
            Scheduling System
          </span>
        </div>
        {/* -------- Account Area -------- */}
        {JSON.stringify(user) != "{}" ? (
          <>
            <div className="grid grid-cols-3 max-[1000px]:grid-cols-1 gap-4 px-10 bg-gray-100 w-5/6 text-center h-fit p-[18px] font-bold rounded-lg">
              <div className="bg-gray-100 col-span-2 ml-5 max-[1000px]:ml-0">
                <div className="text-left">
                  <p className="text-xl font-bold">
                    Wellcome to us{" "}
                    <span className="text-bg-neutral-4">
                      {user.data.lastName}
                    </span>{" "}
                    !
                  </p>
                  <p className="text-base font-semibold text-justify mt-2">
                    Our system is an online medical room management application
                    for schools, which helps medical staff easily manage the
                    information of the visitors, manage the information of the
                    drugs and monitor the health status of the students. In
                    addition, the system also has the function of scheduling
                    appointments for cases that use drugs regularly or students
                    who need health check-ups. Besides, the system also has blog
                    posts sharing information and online chat channels to help
                    students and doctors communicate, creating convenient
                    and time-saving conditions.
                  </p>
                </div>
              </div>
              <div className="w-4/5 ml-10 col-span-1">
                <Image
                  src={homePageImage6}
                  loading="lazy"
                  width={272}
                  height={144}
                  alt="Image 1"
                  style={{ borderRadius: 8 }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 max-[1000px]:grid-cols-1 gap-4 px-10 bg-gray-100 w-5/6 text-center h-fit p-[18px] font-bold rounded-lg">
              <div className="bg-gray-100 col-span-1 ml-5 max-[1000px]:ml-0">
                <div className="text-left">
                  <p className="text-xl font-bold">Wellcome back</p>
                  <p className="text-xs font-normal">
                    Enter your Untitled account details.
                  </p>
                </div>
                <div className="text-left mt-5 hover:scale-110 transition ease-out duration-500">
                  <Link href={"/auth/signin"}>
                    <Button
                      style={{
                        color: "#000000",
                        fontSize: 12,
                        backgroundColor: "#FFFFFF",
                        fontWeight: "normal",
                      }}
                      className="text-xs drop-shadow-xl"
                      icon={<FaUserAlt style={{ color: "#000000" }} />}
                      theme="solid"
                    >
                      Log in with your account
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-gray-100 col-span-1">
                <div className="text-left">
                  <p className="text-xl font-bold">Are you new? Join with us</p>
                  <p className="text-xs font-normal">
                    Create your new account.
                  </p>
                </div>
                <div className="text-left mt-5 hover:scale-110 transition ease-out duration-500">
                  <Link href={"/auth/signup"}>
                    <Button
                      style={{
                        color: "#000000",
                        fontSize: 12,
                        backgroundColor: "#FFFFFF",
                        fontWeight: "normal",
                      }}
                      className="text-xs drop-shadow-xl"
                      icon={<FaUserPlus style={{ color: "#000000" }} />}
                      theme="solid"
                    >
                      Register a new account
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-4/5 ml-10 col-span-1">
                <Image
                  src={homePageImage1}
                  loading="lazy"
                  width={272}
                  height={144}
                  alt="Image 1"
                  style={{ borderRadius: 8 }}
                />
              </div>
            </div>
          </>
        )}
        {/* -------- Prominent features -------- */}
        <div className="bg-gray-100 w-5/6 text-center h-16 p-[18px] font-bold rounded-lg">
          <span className="text-2xl text-bg-neutral-4">Prominent features</span>
        </div>
        {/* -------- Service 1 -------- */}
        <div className="flex flex-col w-5/6">
          <Link href={"/client/schedule/register"} className="pb-6">
            <div className="grid grid-cols-12 px-12 bg-bg-neutral-4 w-full text-center h-fit p-[18px] font-bold rounded-lg hover:scale-105 transition ease-out duration-500">
              <div className="w-4/5 col-span-5 max-[800px]:col-span-12 max-[800px]:ml-9">
                <Image
                  src={homePageImage2}
                  alt="Image 2"
                  loading="lazy"
                  style={{
                    borderRadius: 8,
                    objectFit: "cover",
                    height: 144,
                  }}
                />
              </div>
              <div className="col-span-7 max-[800px]:col-span-12">
                <p className="text-xl font-bold text-white">
                  Meet and get advice from a doctor
                </p>
                <p className="text-xs text-content-neutral-4 text-justify mt-2">
                  Our website facilitates virtual consultations, connecting
                  users with experienced doctors for personalized advice.
                  Through the Meet a Doctor feature, individuals schedule online
                  appointments, share symptoms, and receive tailored
                  recommendations. Our platform prioritizes user privacy,
                  providing a secure environment for proactive health management
                  and informed decision-making.
                </p>
              </div>
            </div>
          </Link>
          {/* -------- End Service 1 -------- */}
          {/* -------- Service 2 -------- */}
          <Link href={"/client/waitingPatient/list"} className="pb-6">
            <div className="grid grid-cols-12 px-12 bg-brand-neutral-5 w-full text-center h-fit p-[18px] font-bold rounded-lg hover:scale-105 transition ease-out duration-500">
              <div className="col-span-7 max-[800px]:col-span-12">
                <p className="text-xl font-bold text-bg-neutral-4">
                  Reschedule visits
                </p>
                <p className="text-xs text-black text-justify mt-2">
                  Our website simplifies scheduling for counseling sessions.
                  Users can easily book appointments for consultations through
                  our intuitive interface. This streamlined process ensures
                  efficient and convenient access to expert advice, allowing
                  individuals to manage their appointments and prioritize their
                  health with ease.
                </p>
              </div>
              <div className="w-4/5 col-span-5 ml-auto max-[800px]:col-span-12 max-[800px]:ml-9">
                <Image
                  src={homePageImage3}
                  alt="Image 2"
                  loading="lazy"
                  style={{
                    borderRadius: 8,
                    objectFit: "cover",
                    height: 144,
                  }}
                />
              </div>
            </div>
          </Link>

          {/* -------- End Service 2 -------- */}
          {/* -------- Service 3 -------- */}
          <Link href={"/client/blog/list"} className="pb-6">
            <div className="grid grid-cols-12 px-12 bg-gray-100 w-full text-center h-fit p-[18px] font-bold rounded-lg hover:scale-105 transition ease-out duration-500">
              <div className="w-4/5 col-span-5 max-[800px]:col-span-12 max-[800px]:ml-9">
                <Image
                  src={homePageImage4}
                  alt="Image 2"
                  loading="lazy"
                  style={{
                    borderRadius: 8,
                    objectFit: "cover",
                    objectPosition: "top",
                    height: 144,
                  }}
                />
              </div>
              <div className="col-span-7 max-[800px]:col-span-12">
                <p className="text-xl font-bold text-bg-neutral-4">
                  Health and related issues blog posts
                </p>
                <p className="text-xs text-black text-justify mt-2">
                  Our health website provides a unique platform for users to
                  explore and learn about various health and wellness topics.
                  With a user-friendly interface, individuals can access
                  high-quality blogs sharing the latest information on
                  nutrition, fitness, and health trends. The search and sharing
                  functions optimize the browsing experience, allowing users to
                  enjoy quality information from a diverse health community.
                </p>
              </div>
            </div>
          </Link>
          {/* -------- End Service 3 -------- */}
        </div>
      </div>
    </>
  );
}
