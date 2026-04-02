import { cn } from "@/lib/utils/cn";
import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          "bg-[#C8F400] text-[#111110]": variant === "default",
          "bg-green-100 text-green-700": variant === "success",
          "bg-yellow-100 text-yellow-700": variant === "warning",
          "bg-red-100 text-red-600": variant === "error",
          "border border-gray-200 text-gray-600 bg-transparent": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
