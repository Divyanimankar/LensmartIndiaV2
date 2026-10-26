"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // In pages par footer nahi dikhega
  const hideFooterRoutes = [
    "/my-account",
    "/login",
    "/register"
  ];

  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
}