import { format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export function formatJPY(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "yyyy年M月d日", { locale: ja });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "yyyy年M月d日 HH:mm", { locale: ja });
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ja });
}
