import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toZonedTime } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toEasternTime(date: Date){
  return toZonedTime(date, "America/New_York").toLocaleString();
}

export function dateFormatter(date: Date) {
  const utcDate = date.getUTCDate();
  const utcMonth = date.getUTCMonth();
  const utcYear = date.getUTCFullYear();
  return `${utcMonth + 1}/${utcDate}/${utcYear}`;
}

export function isOverdue(date: Date) {
  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const dueDateMidnight = date.getTime() + millisecondsInDay;
  return dueDateMidnight < new Date().getTime();
}
