interface TennoteLogoProps {
  size?: number;
  className?: string;
}

/* ロゴ F — 白地×青枠×Tnセリフイタリック×黄ドット */
export function TennisBallLogo({ size = 36, className = "" }: TennoteLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 白地×青枠 */}
      <rect x="2.5" y="2.5" width="35" height="35" rx="11" fill="white" stroke="#1B4FD8" strokeWidth="2.5"/>

      {/* Tn — Playfair Display italic */}
      <text
        x="20"
        y="29"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, 'Times New Roman', serif"
        fontSize="22"
        fontWeight="700"
        fill="#1B4FD8"
        fontStyle="italic"
      >
        Tn
      </text>

      {/* 黄色ドット */}
      <circle cx="33" cy="7" r="4.5" fill="#C8F400"/>
    </svg>
  );
}
