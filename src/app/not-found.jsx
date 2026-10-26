"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/styles/productNotFound.css";

export default function NotFound() {
  const pathname = usePathname() || "";

  // URL dekh ke decide karo: eyeglasses / sunglasses / baaki
  let name = "";
  let base = "/";

  if (pathname.startsWith("/eyeglasses")) {
    name = "Eyeglasses";
    base = "/eyeglasses";
  } else if (pathname.startsWith("/sunglasses")) {
    name = "Sunglasses";
    base = "/sunglasses";
  }

  return (
    <div className="sundetail-not-found">
      <h1>{name ? "Products Not Found" : "Page Not Found"}</h1>
      <p>
        {name
          ? `No ${name.toLowerCase()} are available in this section right now.`
          : "The page you are looking for is not available."}
      </p>
      <Link href={base}>{name ? `Back to ${name}` : "Back to Home"}</Link>
    </div>
  );
}