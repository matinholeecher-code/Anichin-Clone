"use client";

import { useEffect, useState } from "react";
import { getCountdown } from "@/lib/helpers";
import { ReleaseDay } from "@/types";

export function CountdownBadge({ day, time }: { day?: ReleaseDay; time?: string }) {
  const [countdown, setCountdown] = useState(() => getCountdown(day, time));

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown(day, time)), 60000);
    return () => clearInterval(interval);
  }, [day, time]);

  if (!day) return null;

  return (
    <p className={`text-[10px] ${countdown.isLive ? "text-[#2ecc71] font-semibold" : "text-[#a0a0a0]"}`}>
      {countdown.label}
    </p>
  );
}
