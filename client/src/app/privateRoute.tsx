"use client";
import Loader from "@/components/load/loader";
import { StateContext } from "@/context/state";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLog } = useContext(StateContext); // Lấy thông tin đăng nhập
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Trạng thái để xử lý khi đang kiểm tra đăng nhập

  useEffect(() => {
    if (typeof isLog === "undefined") {
      return;
    }
    console.log(isLog)
    setLoading(false);
    if (!isLog) {
      router.push("/auth");
    } else {
      const url = window.location.href;
      url.split("3001")[1] === "/auth"
        ? router.push("/")
        : router.push(url.split("3001")[1]);
    }
  }, [isLog]);
  if (loading) {
    return <Loader />;
  }
  return isLog ? children : null;
};

export default PrivateRoute;
