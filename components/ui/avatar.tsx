import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const px = sizeMap[size];
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-[#4A5C00] flex items-center justify-center flex-shrink-0",
        className
      )}
      style={{ width: px, height: px }}
    >
      {src ? (
        <Image src={src} alt={name ?? "avatar"} fill className="object-cover" />
      ) : (
        <span
          className="font-bold text-gray-900 select-none"
          style={{ fontSize: px * 0.35 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
