/* ------------------------------------------------------------------ */
/* Tennote — ロゴ④バリエーション × フォント10案 プレビューページ         */
/* ------------------------------------------------------------------ */

function LogoCard({ letter, name, desc, children }: {
  letter: string; name: string; desc: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-5 border border-blue-100 hover:border-[#1B4FD8] transition-all">
      {children}
      <div className="text-center">
        <p className="text-xs font-bold text-[#1B4FD8]">{letter}　{name}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function SidebarMock({ fontStyle, fontLabel }: { fontStyle: React.CSSProperties; fontLabel: string }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-blue-100 rounded-2xl px-5 py-3.5">
      {/* Logo F — 白地×青枠×黄ドット */}
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
        <rect x="2.5" y="2.5" width="35" height="35" rx="11" fill="white" stroke="#1B4FD8" strokeWidth="2.5"/>
        <text x="20" y="29" textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="22" fontWeight="700" fill="#1B4FD8" fontStyle="italic">Tn</text>
        <circle cx="33" cy="7" r="4.5" fill="#C8F400"/>
      </svg>
      <span className="text-gray-900 leading-none" style={{ fontSize: "22px", ...fontStyle }}>
        Tennote
      </span>
      <span className="ml-auto text-[10px] text-gray-300 shrink-0">{fontLabel}</span>
    </div>
  );
}

export default function LogoPreviewPage() {
  return (
    <div className="flex flex-col gap-12">

      {/* ═══════════════════════════════════ */}
      {/* SECTION 1 — ロゴ④ バリエーション  */}
      {/* ═══════════════════════════════════ */}
      <section>
        <h1 className="text-2xl font-black text-gray-900">ロゴ④ バリエーション 10案</h1>
        <p className="text-sm text-gray-500 mt-1">気に入ったアルファベット（A〜J）を教えてください</p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-5">

          {/* A */}
          <LogoCard letter="A" name="スタンダード" desc="青×セリフ×黄ドット">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="11" fill="#1B4FD8"/>
              <text x="20" y="28" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="22" fontWeight="700" fill="white" fontStyle="italic">Tn</text>
              <circle cx="33" cy="7" r="4" fill="#C8F400"/>
            </svg>
          </LogoCard>

          {/* B */}
          <LogoCard letter="B" name="ディープネイビー" desc="ナイト×黄ライン">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="11" fill="#0F172A"/>
              <text x="20" y="26" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="22" fontWeight="700" fill="white" fontStyle="italic">Tn</text>
              <rect x="9" y="32" width="22" height="3" rx="1.5" fill="#C8F400"/>
            </svg>
          </LogoCard>

          {/* C */}
          <LogoCard letter="C" name="サークル" desc="丸型バッジ">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" fill="#1B4FD8"/>
              <text x="20" y="28" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="22" fontWeight="700" fill="white" fontStyle="italic">Tn</text>
              <circle cx="32" cy="8" r="4.5" fill="#C8F400"/>
              <circle cx="13" cy="9" r="2.5" fill="white" opacity="0.18"/>
            </svg>
          </LogoCard>

          {/* D */}
          <LogoCard letter="D" name="グラデ" desc="青グラデーション">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="lgD" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2563EB"/>
                  <stop offset="100%" stopColor="#1B4FD8"/>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="36" height="36" rx="11" fill="url(#lgD)"/>
              <rect x="2" y="2" width="36" height="36" rx="11" fill="white" fillOpacity="0.06"/>
              <text x="20" y="28" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="22" fontWeight="700" fill="white" fontStyle="italic">Tn</text>
              <circle cx="33" cy="7" r="4" fill="#C8F400"/>
              <circle cx="10" cy="9" r="3" fill="white" fillOpacity="0.15"/>
            </svg>
          </LogoCard>

          {/* E */}
          <LogoCard letter="E" name="イエロー反転" desc="黄背景×青Tn">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="11" fill="#C8F400"/>
              <text x="20" y="28" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="22" fontWeight="700" fill="#1B4FD8" fontStyle="italic">Tn</text>
              <circle cx="33" cy="7" r="4" fill="#1B4FD8"/>
              <circle cx="12" cy="9" r="2.5" fill="white" fillOpacity="0.4"/>
            </svg>
          </LogoCard>

          {/* F */}
          <LogoCard letter="F" name="アウトライン" desc="白地×青枠×黄ドット">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
              <rect x="3" y="3" width="34" height="34" rx="10" fill="white" stroke="#1B4FD8" strokeWidth="2.5"/>
              <text x="20" y="28" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="22" fontWeight="700" fill="#1B4FD8" fontStyle="italic">Tn</text>
              <circle cx="33" cy="7" r="4" fill="#C8F400"/>
            </svg>
          </LogoCard>

          {/* G */}
          <LogoCard letter="G" name="バイカラー" desc="青×黄 2分割">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
              <defs>
                <clipPath id="lgG"><rect x="2" y="2" width="36" height="36" rx="11"/></clipPath>
              </defs>
              <rect x="2" y="2" width="36" height="36" rx="11" fill="#1B4FD8"/>
              <rect x="20" y="2" width="20" height="36" fill="#C8F400" clipPath="url(#lgG)"/>
              <text x="13" y="28" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="22" fontWeight="700" fill="white" fontStyle="italic">T</text>
              <text x="28" y="28" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="22" fontWeight="700" fill="#1B4FD8" fontStyle="italic">n</text>
            </svg>
          </LogoCard>

          {/* H */}
          <LogoCard letter="H" name="ピルシェイプ" desc="横長カプセル型">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="11" width="36" height="22" rx="11" fill="#1B4FD8"/>
              <text x="19" y="27" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="19" fontWeight="700" fill="white" fontStyle="italic">Tn</text>
              <circle cx="35" cy="11" r="5" fill="#C8F400"/>
            </svg>
          </LogoCard>

          {/* I */}
          <LogoCard letter="I" name="ビッグT" desc="大T×黄色小n">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="11" fill="#1B4FD8"/>
              <text x="15" y="30" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="28" fontWeight="700" fill="white" fontStyle="italic">T</text>
              <text x="30" y="34" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="14" fontWeight="700" fill="#C8F400" fontStyle="italic">n</text>
            </svg>
          </LogoCard>

          {/* J */}
          <LogoCard letter="J" name="ソフトラウンド" desc="角丸MAX×洗練">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="lgJ" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3B82F6"/>
                  <stop offset="100%" stopColor="#1B4FD8"/>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="36" height="36" rx="18" fill="url(#lgJ)"/>
              <text x="20" y="27" textAnchor="middle"
                fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
                fontSize="20" fontWeight="700" fill="white" fontStyle="italic">Tn</text>
              <circle cx="29" cy="33" r="3.5" fill="#C8F400"/>
              <circle cx="12" cy="8" r="2.5" fill="white" fillOpacity="0.22"/>
            </svg>
          </LogoCard>

        </div>
      </section>


      {/* ═══════════════════════════════════ */}
      {/* SECTION 2 — フォント 10パターン   */}
      {/* ═══════════════════════════════════ */}
      <section className="pb-8">
        <h2 className="text-2xl font-black text-gray-900">フォント 10パターン</h2>
        <p className="text-sm text-gray-500 mt-1">サイドバーでの「Tennote」文字の表示。ロゴAと組み合わせ</p>

        <div className="flex flex-col gap-2.5 mt-5">

          <SidebarMock
            fontLabel="① Sans-serif Black（現在）"
            fontStyle={{ fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900 }}
          />

          <SidebarMock
            fontLabel="② Playfair Display — エレガントセリフ"
            fontStyle={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontStyle: "italic" }}
          />

          <SidebarMock
            fontLabel="③ Cormorant Garamond — クラシック筆記"
            fontStyle={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontStyle: "italic", fontSize: "26px" }}
          />

          <SidebarMock
            fontLabel="④ Dancing Script — 手書き筆記体"
            fontStyle={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700, fontSize: "26px" }}
          />

          <SidebarMock
            fontLabel="⑤ Satisfy — 流れる筆記体"
            fontStyle={{ fontFamily: "'Satisfy', cursive", fontSize: "24px" }}
          />

          <SidebarMock
            fontLabel="⑥ Lobster — レトロスクリプト"
            fontStyle={{ fontFamily: "'Lobster', cursive", fontSize: "26px" }}
          />

          <SidebarMock
            fontLabel="⑦ Pacifico — 丸みのある筆記体"
            fontStyle={{ fontFamily: "'Pacifico', cursive", fontSize: "22px" }}
          />

          <SidebarMock
            fontLabel="⑧ Oswald Bold — スポーティ コンデンス"
            fontStyle={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: "0.06em" }}
          />

          <SidebarMock
            fontLabel="⑨ Bebas Neue — ALL CAPS ストロング"
            fontStyle={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.12em", fontSize: "24px" }}
          />

          <SidebarMock
            fontLabel="⑩ Space Mono — テック・コード風"
            fontStyle={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "17px" }}
          />

        </div>
      </section>

    </div>
  );
}
