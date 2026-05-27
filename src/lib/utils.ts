import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPlanColor(plan: string): string {
  switch (plan) {
    case "ELITE": return "text-amber-400";
    case "PRO": return "text-violet-400";
    default: return "text-slate-400";
  }
}

export function getPlanBadgeClass(plan: string): string {
  switch (plan) {
    case "ELITE": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "PRO": return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

export const PLANS = {
  FREE: { name: "Free", price: 0, yearlyPrice: 0, limit: 10 },
  PRO: { name: "Pro", price: 1900, yearlyPrice: 15200, limit: 100 },
  ELITE: { name: "Elite", price: 4900, yearlyPrice: 39200, limit: -1 },
} as const;
