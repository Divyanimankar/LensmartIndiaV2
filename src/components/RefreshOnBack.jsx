"use client";

import { useEffect } from "react";

export default function RefreshOnBack() {
  useEffect(() => {
    const onShow = (e) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  return null;
}