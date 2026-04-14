export function TenCoachAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ===== 耳（まるっこい三角） ===== */}
      <ellipse cx="28" cy="26" rx="13" ry="15" fill="#FFD700" />
      <ellipse cx="72" cy="26" rx="13" ry="15" fill="#FFD700" />
      {/* 耳の内側（ピンク） */}
      <ellipse cx="28" cy="28" rx="7" ry="9" fill="#FFAEC0" />
      <ellipse cx="72" cy="28" rx="7" ry="9" fill="#FFAEC0" />

      {/* ===== 顔（黄色まんまる） ===== */}
      <circle cx="50" cy="57" r="36" fill="#FFD700" />
      {/* 顔の輪郭（やわらかい影） */}
      <circle cx="50" cy="57" r="36" fill="none" stroke="#F0BE00" strokeWidth="1.5" />

      {/* ===== テニスボールの白い縫い目 ===== */}
      <path
        d="M17,50 Q26,38 17,26"
        stroke="white" strokeWidth="2.8" fill="none"
        strokeLinecap="round" opacity="0.8"
      />
      <path
        d="M83,50 Q74,38 83,26"
        stroke="white" strokeWidth="2.8" fill="none"
        strokeLinecap="round" opacity="0.8"
      />

      {/* ===== 目（ちいかわ風・大きくてつぶら） ===== */}
      <circle cx="38" cy="53" r="7" fill="#1A1A2E" />
      <circle cx="62" cy="53" r="7" fill="#1A1A2E" />
      {/* 白目ハイライト */}
      <circle cx="40.5" cy="50" r="3" fill="white" />
      <circle cx="64.5" cy="50" r="3" fill="white" />
      <circle cx="37" cy="56" r="1.5" fill="white" opacity="0.5" />
      <circle cx="61" cy="56" r="1.5" fill="white" opacity="0.5" />

      {/* ===== ほっぺた（キティちゃん風） ===== */}
      <ellipse cx="26" cy="63" rx="8" ry="5" fill="#FFAEC0" opacity="0.6" />
      <ellipse cx="74" cy="63" rx="8" ry="5" fill="#FFAEC0" opacity="0.6" />

      {/* ===== 鼻（小さなハート風） ===== */}
      <ellipse cx="50" cy="63" rx="3.5" ry="3" fill="#FF8FAB" />

      {/* ===== 口（にっこり「w」） ===== */}
      <path
        d="M43,68 Q47,73 50,70 Q53,73 57,68"
        stroke="#FF8FAB" strokeWidth="2" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ===== ひげ ===== */}
      <line x1="10" y1="61" x2="30" y2="64" stroke="#B8860B" strokeWidth="1.2" opacity="0.35" />
      <line x1="10" y1="67" x2="30" y2="66" stroke="#B8860B" strokeWidth="1.2" opacity="0.35" />
      <line x1="70" y1="64" x2="90" y2="61" stroke="#B8860B" strokeWidth="1.2" opacity="0.35" />
      <line x1="70" y1="66" x2="90" y2="67" stroke="#B8860B" strokeWidth="1.2" opacity="0.35" />

      {/* ===== テニスラケット（右手） ===== */}
      {/* グリップ */}
      <rect x="74" y="72" width="6" height="22" rx="3" fill="#A0522D" />
      <rect x="74.5" y="73" width="5" height="3" rx="1.5" fill="#6B3A1F" />
      <rect x="74.5" y="78" width="5" height="3" rx="1.5" fill="#6B3A1F" />
      {/* ラケットフレーム */}
      <ellipse cx="79" cy="61" rx="13" ry="16" fill="none" stroke="#A0522D" strokeWidth="3.5" />
      {/* ストリングス（縦） */}
      <line x1="73" y1="47" x2="73" y2="75" stroke="#DEB887" strokeWidth="1.1" opacity="0.8" />
      <line x1="79" y1="45.5" x2="79" y2="76" stroke="#DEB887" strokeWidth="1.1" opacity="0.8" />
      <line x1="85" y1="47" x2="85" y2="75" stroke="#DEB887" strokeWidth="1.1" opacity="0.8" />
      {/* ストリングス（横） */}
      <line x1="67" y1="53" x2="91" y2="53" stroke="#DEB887" strokeWidth="1.1" opacity="0.8" />
      <line x1="66" y1="59" x2="92" y2="59" stroke="#DEB887" strokeWidth="1.1" opacity="0.8" />
      <line x1="67" y1="65" x2="91" y2="65" stroke="#DEB887" strokeWidth="1.1" opacity="0.8" />
      <line x1="68" y1="71" x2="90" y2="71" stroke="#DEB887" strokeWidth="1.1" opacity="0.8" />

      {/* ===== 小さなリボン（キティちゃん感） ===== */}
      <path d="M60,28 Q65,22 70,28 Q65,34 60,28Z" fill="#FF6B9D" />
      <path d="M70,28 Q75,22 80,28 Q75,34 70,28Z" fill="#FF6B9D" />
      <circle cx="70" cy="28" r="3" fill="#FF8FAB" />
    </svg>
  );
}
