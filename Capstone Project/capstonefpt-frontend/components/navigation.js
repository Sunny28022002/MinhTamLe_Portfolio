"use client";
import { Button, Nav } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MdLogin } from "react-icons/md";
import { IoIosPersonAdd } from "react-icons/io";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const NavigationComponent = () => {
  const [collapse, setCollapse] = useState(false);
  const token = Cookies.get("token");
  const { menuSetting, handleLogout } = useAuth();
  const [isMenuSettingLoaded, setMenuSettingLoaded] = useState(false);

  useEffect(() => {
    if (menuSetting.length > 0) {
      setMenuSettingLoaded(true);
    }
  }, [menuSetting]);

  if (!isMenuSettingLoaded) {
    // Return a loading state or placeholder while menuSetting is being loaded
    return (
      <>
        <Nav
          onSelect={(data) => console.log("trigger onSelect: ", data)}
          onClick={(data) => console.log("trigger onClick: ", data)}
        >
          <Link href={"/"}>
            <Nav.Header
              logo={
                <img src="https://cdn-icons-png.flaticon.com/512/240/240419.png" />
              }
              className="text-center high-nav-header"
              text={"High Care"}
            />
          </Link>

          <Link href={"/"}>
            <Nav.Item itemKey={"loading"} text={"Loading...."} />
          </Link>
          <Nav.Footer
            collapseButton={true}
            collapseText={(collapsed) => (collapsed ? "Expand" : "Close")}
          />
        </Nav>
      </>
    );
  }

  return (
    <>
      <Nav
        onSelect={(data) => console.log("trigger onSelect: ", data)}
        onClick={(data) => console.log("trigger onClick: ", data)}
      >
        <Link href={"/"}>
          <Nav.Header
            logo={
              <img src="https://cdn-icons-png.flaticon.com/512/240/240419.png" />
            }
            className="text-center high-nav-header"
            text={"High Care"}
          />
        </Link>
        {menuSetting.map((item, idx) =>
          item.type === "item" ? (
            item.itemKey == "logout" ? (
              <Nav.Item
                className="logoutItem"
                text={item.text}
                onClick={item.click}
              />
            ) : (
              <Link key={idx} href={item.link}>
                <Nav.Item
                  icon={item.icon}
                  itemKey={item.itemKey}
                  text={item.text}
                />
              </Link>
            )
          ) : (
            <Nav.Sub
              key={idx}
              itemKey={item.itemKey}
              text={item.text}
              icon={item.icon}
            >
              {item.items?.map((ele, subIdx) => (
                <Link key={subIdx} href={ele.link}>
                  <Nav.Item
                    itemKey={ele.itemKey}
                    text={ele.text}
                    icon={ele.icon}
                    className="ml-8"
                  />
                </Link>
              ))}
            </Nav.Sub>
          )
        )}
        <Nav.Footer
          collapseButton={true}
          collapseText={(collapsed) => (collapsed ? "Expand" : "Close")}
        />
      </Nav>
    </>
  );
};

export default NavigationComponent;
