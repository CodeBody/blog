import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

/**
 * Merges Tailwind classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats date to a readable string (e.g., "Oct 12, 2023")
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  return format(new Date(dateString), "MMM dd, yyyy");
}

/**
 * Formats date to relative string (e.g., "2 days ago")
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return "";
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}
