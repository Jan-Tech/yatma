import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min?: number | null, max?: number | null, currency = "TMT") {
  if (!min && !max) return "Aýlyk görkezilmedi";
  if (min && max) return `${min.toLocaleString()} – ${max.toLocaleString()} ${currency}`;
  if (min) return `${min.toLocaleString()} ${currency}-dan`;
  return `${max!.toLocaleString()} ${currency}-a çenli`;
}

export function formatDate(date: Date | string) {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}`;
}

export function whatsappLink(phone: string, jobTitle: string) {
  const text = encodeURIComponent(`Salam! Men Yatma-da siziň "${jobTitle}" iş bildirişiňizi gördüm.`);
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${text}`;
}
