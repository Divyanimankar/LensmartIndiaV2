"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ==========================================================================
   Reusable motion primitives (no dependencies)
   --------------------------------------------------------------------------
   useBump(value)
     Returns a counter that goes up ONLY when `value` increases after the first
     render — i.e. when something was really added. Use it as a React `key`
     (or data attribute) to replay a one-shot CSS animation. Decreases and the
     initial value never animate.

   useStoredCount(storageKey, eventName)
     Number of items in a JSON-array localStorage entry, kept in sync through
     the app's own event ("cartUpdated" / "wishlistUpdated") and the browser
     "storage" event. Registers and removes its listeners exactly once.
========================================================================== */

export function useBump(value) {
  const prev = useRef(value);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (value > prev.current) setTick((t) => t + 1);
    prev.current = value;
  }, [value]);

  return tick;
}

function useStoredStat(storageKey, eventName, measure) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const update = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        const valid = Array.isArray(saved)
          ? saved.filter((item) => item && item.id !== undefined)
          : [];
        setValue(measure(valid));
      } catch {
        setValue(0);
      }
    };

    update();
    window.addEventListener(eventName, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(eventName, update);
      window.removeEventListener("storage", update);
    };
  }, [storageKey, eventName, measure]);

  return value;
}

const lineItems = (items) => items.length;
const units = (items) =>
  items.reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);

/* number of lines in the stored list (what the badge shows) */
export const useStoredCount = (storageKey, eventName) =>
  useStoredStat(storageKey, eventName, lineItems);

/* total units — also rises when the quantity of an existing line goes up */
export const useStoredUnits = (storageKey, eventName) =>
  useStoredStat(storageKey, eventName, units);

/*
  useAnimatedClose(onClosed, ms)
    For overlays that unmount when closed. Returns [closing, close, cancel]:
      closing – true while the exit animation plays (add an `is-closing` class)
      close() – starts the exit, then calls onClosed() after `ms`
                (immediately when the user prefers reduced motion)
      cancel() – abort a pending close (e.g. the overlay is re-opened)
    The pending timer is always cleared on unmount, so nothing leaks.
*/
export function useAnimatedClose(onClosed, ms = 240) {
  const [closing, setClosing] = useState(false);
  const timer = useRef(0);
  const cbRef = useRef(onClosed);
  cbRef.current = onClosed;

  const cancel = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = 0;
    setClosing(false);
  }, []);

  const close = useCallback(() => {
    if (timer.current) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      cbRef.current();
      return;
    }
    setClosing(true);
    timer.current = window.setTimeout(() => {
      timer.current = 0;
      setClosing(false);
      cbRef.current();
    }, ms);
  }, [ms]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return [closing, close, cancel];
}

/*
  useAutoAdvance(containerRef, advance, { delay, enabled })
    Calls `advance()` every `delay` ms (default 3000) for carousels that have
    prev/next controls. One timer, one set of listeners, all cleaned up.

    It never moves while the user is engaged or the carousel can't be seen:
      · pointer hovering the container (mouse/pen)      → paused until it leaves
      · keyboard focus anywhere inside                   → paused until focus leaves
      · touch / pointer press, wheel or key inside       → paused, resumes after 8 s idle
      · carousel scrolled out of view / tab in background → skipped
      · prefers-reduced-motion: reduce                   → never starts
    `advance` may change between renders; the latest one is always used.
*/
export function useAutoAdvance(containerRef, advance, { delay = 3000, enabled = true } = {}) {
  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled || typeof window === "undefined") return undefined;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceQuery.matches) return undefined;

    let timer = 0;
    let idleTimer = 0;
    let hovering = false;
    let focused = false;
    let engaged = false;
    let visible = true;

    const blocked = () =>
      hovering || focused || engaged || !visible || document.hidden || reduceQuery.matches;

    const schedule = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!blocked()) advanceRef.current();
        schedule();
      }, delay);
    };

    const onEnter = (e) => {
      if (e.pointerType === "touch") return;
      hovering = true;
    };
    const onLeave = (e) => {
      if (e.pointerType === "touch") return;
      hovering = false;
      schedule();
    };
    const onFocusIn = () => { focused = true; };
    const onFocusOut = (e) => {
      if (!el.contains(e.relatedTarget)) {
        focused = false;
        schedule();
      }
    };
    const onEngage = () => {
      engaged = true;
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        engaged = false;
        schedule();
      }, 8000);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    el.addEventListener("touchstart", onEngage, { passive: true });
    el.addEventListener("wheel", onEngage, { passive: true });
    el.addEventListener("keydown", onEngage);

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0.25 }
    );
    io.observe(el);

    schedule();

    return () => {
      clearTimeout(timer);
      clearTimeout(idleTimer);
      io.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      el.removeEventListener("touchstart", onEngage);
      el.removeEventListener("wheel", onEngage);
      el.removeEventListener("keydown", onEngage);
    };
  }, [containerRef, delay, enabled]);
}
