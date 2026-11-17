"use client";

import { useEffect } from "react";
import { refreshCart, clearLocalCart } from "@/lib/cartClient";

/* Site khulte hi (aur tab wapas aane par) Shopify se cart laata hai.
   Login hone par saved cart + guest cart jud jaate hain (server par).
   Logout ke baad is browser ka cart saaf ho jaata hai. */

const FLAG = "lmCartWasLoggedIn";

export default function CartSync() {
  useEffect(() => {
    const sync = async () => {
      try {
        const data = await refreshCart();

        let was = false;
        try {
          was = localStorage.getItem(FLAG) === "1";
        } catch {}

        if (data.loggedIn) {
          try {
            localStorage.setItem(FLAG, "1");
          } catch {}
        } else if (was) {
          /* pehle login tha, ab nahi -> logout hua */
          try {
            localStorage.removeItem(FLAG);
          } catch {}
          await clearLocalCart();
        }
      } catch {
        /* network error — ignore */
      }
    };

    sync();

    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return null;
}