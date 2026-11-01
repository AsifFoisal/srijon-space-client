import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return usd.format(value);
}

export function parseDate(value: string) {
  return parseISO(value);
}

export function formatDateLabel(value: string, pattern = "EEE, MMM d, yyyy") {
  return format(parseISO(value), pattern);
}

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function durationInHours(startTime: string, endTime: string) {
  const diff = timeToMinutes(endTime) - timeToMinutes(startTime);
  if (diff <= 0) return 0;
  return Math.round((diff / 60) * 100) / 100;
}

export function formatTimeLabel(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function formatDuration(hours: number) {
  if (hours <= 0) return "0 hrs";
  if (hours === 1) return "1 hr";
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hrs`;
}

export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

// Placeholder ratings until real ones exist in the database — deterministic
// per studio, so the same listing always shows the same score.
export function getMockRating(id: string) {
  const seed = Number.parseInt(id.slice(-6), 16) || 0;
  return {
    rating: Math.round((4.3 + (seed % 7) / 10) * 10) / 10,
    reviewCount: 6 + (seed % 40),
  };
}

// Uploads an image file to imgbb and resolves with the hosted URL.
export async function uploadToImgbb(file: File) {
  const body = new FormData();
  body.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    { method: "POST", body },
  );
  const data = await res.json();
  if (!data?.success) {
    throw new Error("Image upload failed.");
  }
  return data.data.url as string;
}

export const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function weekdayName(day: number) {
  return WEEKDAY_NAMES[day] ?? "";
}

