import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNowStrict, isPast, isToday } from "date-fns";
import { arSA } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

import type { PriorityLevel } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTaskDate(date: Date | null | undefined) {
  if (!date) {
    return "بدون تاريخ";
  }

  if (isToday(date)) {
    return `اليوم، ${format(date, "p", { locale: arSA })}`;
  }

  return format(date, "d MMMM yyyy", { locale: arSA });
}

export function formatRelativeArabic(date: Date) {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: arSA
  });
}

export function isOverdue(date: Date | null | undefined, completed: boolean) {
  return Boolean(date && !completed && isPast(date) && !isToday(date));
}

export function getPriorityLabel(priority: PriorityLevel) {
  return {
    HIGH: "عالية",
    MEDIUM: "متوسطة",
    LOW: "منخفضة"
  }[priority];
}

export function getPriorityTone(priority: PriorityLevel) {
  return {
    HIGH: "bg-danger-soft text-[#410002]",
    MEDIUM: "bg-muted-chip text-text-base",
    LOW: "bg-surface-high text-text-soft"
  }[priority];
}
