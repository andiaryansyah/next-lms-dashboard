"use client";

import { useEffect } from "react";

const initApp = () => fetch("/api/system/init").then((res) => res.json());

export default function InitClient() {
  useEffect(() => {
    initApp();
  }, []);

  return null;
}
