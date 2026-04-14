export function TenCoachAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 左耳 */}
      <polygon points="14,34 22,12 32,34" fill="#C8F400" />
      <polygon points="17,32 22,17 29,32" fill="#F4FF80" />

      {/* 右耳 */}
      <polygon points="48,34 58,12 66,34" fill="#C8F400" />
      <polygon points="51,32 58,17 63,32" fill="#F4FF80" />

      {/* テニスボール顔（メイン円） */}
      <circle cx="40" cy="46" r="30" fill="#C8F400" />

      {/* テニスボールの白い曲線（縫い目） */}
      <path d="M12,38 Q22,28 12,18" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M68,38 Q58,28 68,18" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* 目（大きくてかわいい） */}
      <ellipse cx="31" cy="44" rx="5" ry="6" fill="#1A1A2E" />
      <ellipse cx="49" cy="44" rx="5" ry="6" fill="#1A1A2E" />
      {/* 目のハイライト */}
      <circle cx="33" cy="41.5" r="2" fill="white" />
      <circle cx="51" cy="41.5" r="2" fill="white" />
      <circle cx="29.5" cy="46.5" r="1" fill="white" opacity="0.6" />
      <circle cx="47.5" cy="46.5" r="1" fill="white" opacity="0.6" />

      {/* 鼻 */}
      <ellipse cx="40" cy="52" rx="3" ry="2.2" fill="#FF8FAB" />

      {/* 口（にっこり） */}
      <path d="M36,55 Q40,60 44,55" stroke="#FF8FAB" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* ひげ（左） */}
      <line x1="16" y1="51" x2="33" y2="53" stroke="#2D2D2D" strokeWidth="1" opacity="0.4" />
      <line x1="16" y1="56" x2="33" y2="55" stroke="#2D2D2D" strokeWidth="1" opacity="0.4" />
      {/* ひげ（右） */}
      <line x1="47" y1="53" x2="64" y2="51" stroke="#2D2D2D" strokeWidth="1" opacity="0.4" />
      <line x1="47" y1="55" x2="64" y2="56" stroke="#2D2D2D" strokeWidth="1" opacity="0.4" />

      {/* テニスラケット（右手に持つ） */}
      {/* グリップ */}
      <rect x="58" y="60" width="5" height="17" rx="2.5" fill="#8B6914" />
      {/* グリップテープ */}
      <rect x="58.5" y="61" width="4" height="2.5" rx="1" fill="#5C4A1A" />
      <rect x="58.5" y="65" width="4" height="2.5" rx="1" fill="#5C4A1A" />
      {/* ラケットフレーム */}
      <ellipse cx="63" cy="51" rx="11" ry="13" fill="none" stroke="#8B6914" strokeWidth="3" />
      {/* ストリングス（縦） */}
      <line x1="59" y1="40" x2="59" y2="62" stroke="#D4A853" strokeWidth="0.9" opacity="0.7" />
      <line x1="63" y1="38.5" x2="63" y2="63" stroke="#D4A853" strokeWidth="0.9" opacity="0.7" />
      <line x1="67" y1="40" x2="67" y2="62" stroke="#D4A853" strokeWidth="0.9" opacity="0.7" />
      {/* ストリングス（横） */}
      <line x1="53" y1="45" x2="73" y2="45" stroke="#D4A853" strokeWidth="0.9" opacity="0.7" />
      <line x1="52" y1="50" x2="74" y2="50" stroke="#D4A853" strokeWidth="0.9" opacity="0.7" />
      <line x1="53" y1="55" x2="73" y2="55" stroke="#D4A853" strokeWidth="0.9" opacity="0.7" />
    </svg>
  );
}
