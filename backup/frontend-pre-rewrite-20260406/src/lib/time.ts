import {
  formatDistanceStrict,
  intervalToDuration,
} from "date-fns";
import { zhCN } from "date-fns/locale";

const DISPLAY_TIME_ZONE = "Asia/Shanghai";
const DAY_MS = 24 * 60 * 60 * 1000;

export function formatOpenDate(input: string | Date) {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: DISPLAY_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date(input));
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${pick("year")} 年 ${pick("month")} 月 ${pick("day")} 日 ${pick("hour")}:${pick("minute")}`;
}

export function daysUntil(input: string | Date) {
  return Math.max(
    0,
    Math.floor((new Date(input).getTime() - new Date().getTime()) / DAY_MS),
  );
}

export function daysSince(input: string | Date) {
  return Math.max(
    0,
    Math.floor((new Date().getTime() - new Date(input).getTime()) / DAY_MS),
  );
}

export function relativeDistance(from: string | Date, to = new Date()) {
  return formatDistanceStrict(new Date(from), to, {
    locale: zhCN,
  });
}

export function breakdownCountdown(input: string | Date, from = new Date()) {
  const target = new Date(input);
  const safeTarget = target.getTime() > from.getTime() ? target : from;

  return intervalToDuration({
    start: from,
    end: safeTarget,
  });
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function toCapsuleOpenIso(dateInput: string) {
  return `${dateInput}T12:00:00.000Z`;
}
