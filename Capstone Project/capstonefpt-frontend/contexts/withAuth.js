"use client";
import { useContext, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getRoleFromToken } from "@/libs/common";

export function withAuth(WrappedPage, role) {
  const Wrapper = (props) => {
    // let { role } = useAuth();
    let router = useRouter();
    let token = Cookies.get("token");

    useEffect(() => {
      if (!token) {
        router.replace("/auth/signin");
      } else {
        const roleFromToken = getRoleFromToken(token);
        if (roleFromToken != role) {
          router.replace("/auth/error/403");
        }
      }
    }, [token]);

    return <WrappedPage {...props} />;
  };

  return Wrapper;
}
