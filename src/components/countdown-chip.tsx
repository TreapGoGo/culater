"use client";

import { useEffect, useState } from "react";
import { breakdownCountdown } from "@/lib/time";

type CountdownChipProps = {
  openAt: string;
  large?: boolean;
};

export function CountdownChip({
  openAt,
  large = false,
}: CountdownChipProps) {
  const [now, setNow] = useState(() => new Date(openAt));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdown = breakdownCountdown(openAt, now);
  const segments = [
    { label: "天", value: countdown.days ?? 0 },
    { label: "小时", value: countdown.hours ?? 0 },
    { label: "分钟", value: countdown.minutes ?? 0 },
    { label: "秒", value: countdown.seconds ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {segments.map((segment) => (
        <div
          key={segment.label}
          className="time-pill rounded-[1.5rem] px-4 py-3 text-center"
        >
          <div className={large ? "text-3xl font-semibold" : "text-2xl font-semibold"}>
            {String(segment.value).padStart(2, "0")}
          </div>
          <div className="fine-copy mt-1 text-xs">{segment.label}</div>
        </div>
      ))}
    </div>
  );
}
