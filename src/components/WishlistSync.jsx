"use client";

import { useEffect, useRef } from "react";

/* Wishlist: browser (localStorage) <-> customer metafield (login ke baad)

   - Pehli baar login: is browser ki wishlist + saved wishlist jud jaati hain.
   - Uske baad: saved (server) wishlist hi sahi maani jaati hai
     (dusre device par hataya hua product wapas nahi aata).
   - Har badlav 1 second ruk kar server par save hota hai.
   - Logout ke baad is browser ki wishlist saaf. */

const KEY = "lensmartWishlist";
const SYNCED = "lmWishlistSynced"; /* "1" = is browser ne pehle sync kar liya */
const WAS_IN = "lmWishWasLoggedIn";

const sameItem = (a, b) =>
  String(a.id) === String(b.id) && a.productType === b.productType;

const readLocal = () => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY)) || [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const get = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const set = (key, value) => {
  try {
    value === null ? localStorage.removeItem(key) : localStorage.setItem(key, value);
  } catch {}
};

export default function WishlistSync() {
  const applying = useRef(false);
  const loggedIn = useRef(false);
  const timer = useRef(null);

  useEffect(() => {
    const writeLocal = (list) => {
      applying.current = true;
      set(KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("wishlistUpdated"));
      applying.current = false;
    };

    const push = async (list) => {
      try {
        await fetch("/api/wishlist", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ items: list }),
        });
      } catch {}
    };

    const pull = async () => {
      try {
        const response = await fetch("/api/wishlist", {
          credentials: "same-origin",
          cache: "no-store",
        });
        const data = await response.json();

        if (!data.loggedIn) {
          loggedIn.current = false;

          /* pehle login tha, ab nahi -> logout: wishlist saaf */
          if (get(WAS_IN) === "1") {
            set(WAS_IN, null);
            set(SYNCED, null);
            writeLocal([]);
          }
          return;
        }

        loggedIn.current = true;
        set(WAS_IN, "1");

        const server = Array.isArray(data.items) ? data.items : [];
        const local = readLocal();

        if (get(SYNCED) === "1") {
          /* server hi sahi */
          if (JSON.stringify(server) !== JSON.stringify(local)) writeLocal(server);
        } else {
          /* pehli baar: dono jodo */
          const merged = [...server];
          local.forEach((item) => {
            if (!merged.some((saved) => sameItem(saved, item))) merged.push(item);
          });

          writeLocal(merged);
          await push(merged);
          set(SYNCED, "1");
        }
      } catch {
        /* network error — ignore */
      }
    };

    /* local badlav -> server par (1 sec ruk kar) */
    const onChange = () => {
      if (applying.current || !loggedIn.current) return;

      clearTimeout(timer.current);
      timer.current = setTimeout(() => push(readLocal()), 1000);
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") pull();
    };

    pull();

    window.addEventListener("wishlistUpdated", onChange);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("wishlistUpdated", onChange);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}