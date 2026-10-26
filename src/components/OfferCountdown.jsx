"use client";

import { useEffect, useState } from "react";

/* Counts down to the end of today (resets every midnight).
   Place this file at: src/components/OfferCountdown.jsx */

const pad = (n) => String(n).padStart(2, "0");

export default function OfferCountdown() {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      setLeft(Math.max(0, end.getTime() - now.getTime()));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const total = left === null ? null : Math.floor(left / 1000);

  const units = [
    { label: "Hours", value: total === null ? "--" : pad(Math.floor(total / 3600)) },
    { label: "Minutes", value: total === null ? "--" : pad(Math.floor((total % 3600) / 60)) },
    { label: "Seconds", value: total === null ? "--" : pad(total % 60) },
  ];

  return (
    <div className="lmo-timer" role="timer" aria-label="Time left for today's deals">
      {units.map((unit, index) => (
        <div className="lmo-timer-unit" key={unit.label}>
          <div className="lmo-timer-box">
            <strong>{unit.value}</strong>
            <span>{unit.label}</span>
          </div>
          {index < units.length - 1 && <b aria-hidden="true">:</b>}
        </div>
      ))}
    </div>
  );
}
