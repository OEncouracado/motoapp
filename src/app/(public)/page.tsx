"use client";

import { useApp } from "@/context/AppContext";
import React from "react";

export default function Page() {

  const { isLoggedIn } = useApp();
  
  React.useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
    } else {
      window.location.href = "/home";
    }
  }, [isLoggedIn]);

  
  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
    >
      
    </div>
  );
}

