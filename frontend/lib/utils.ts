import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormatter(date: Date) {
  const utcDate = date.getUTCDate();
  const utcMonth = date.getUTCMonth();
  const utcYear = date.getUTCFullYear();
  const weekDay = date.getUTCDay();
  return `${utcMonth+1}/${utcDate}/${utcYear}`;
}

export function isOverdue(date: Date){
  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const dueDateMidnight =  date.getTime() + millisecondsInDay;
  return dueDateMidnight < new Date().getTime();
}