import {
  differenceInCalendarDays,
  format,
  formatDistanceStrict,
  intervalToDuration,
} from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatOpenDate(input: string | Date) {
  return format(new Date(input), "yyyy 年 M 月 d 日 HH:mm", {
    locale: zhCN,
  });
}

export function daysUntil(input: string | Date) {
  return Math.max(0, differenceInCalendarDays(new Date(input), new Date()));
}

export function daysSince(input: string | Date) {
  return Math.max(0, differenceInCalendarDays(new Date(), new Date(input)));
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
