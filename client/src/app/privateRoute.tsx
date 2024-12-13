"use client";
import Loader from "@/components/load/loader";
import { StateContext } from "@/context/state";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLog } = useContext(StateContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof isLog === "undefined") {
      return;
    }
    setLoading(false);
    if (!isLog) {
      router.push("/auth");
    } else {
      const url = window.location.href;
      url.includes("/auth")
        ? router.push("/")
        : router.push(url);
    }
  }, [isLog]);
  if (loading) {
    return <Loader />;
  }
  return children;
};

export default PrivateRoute;
