export type BodyType = "straight" | "wave" | "natural";
export type ColorSeason = "spring" | "summer" | "autumn" | "winter";

export interface WearRecommendation {
  brand: string;
  style: string;
  colors: string[];
  colorHexes: string[];
  silhouette: string;
  avoidColors: string[];
  tips: string[];
}

// ─── 骨格診断 ───────────────────────────────────────────
export const BODY_TYPE_INFO: Record<BodyType, {
  name: string;
  description: string;
  features: string[];
  emoji: string;
}> = {
  straight: {
    name: "ストレート",
    description: "メリハリのあるボディライン。シンプルでフィット感のあるウェアが映えます。",
    features: ["胸・ウエスト・ヒップのバランスが良い", "筋肉質でハリがある", "シンプルなデザインが似合う"],
    emoji: "⬆️",
  },
  wave: {
    name: "ウェーブ",
    description: "柔らかな曲線美のボディライン。フィット感があり動きやすいウェアが最適。",
    features: ["全体的にソフトな印象", "華奢でスレンダー", "柔らかい素材が似合う"],
    emoji: "〰️",
  },
  natural: {
    name: "ナチュラル",
    description: "骨格がしっかりした自然体のボディライン。ゆとりのあるデザインが活きます。",
    features: ["骨感がある", "肩幅がある", "ゆったりとしたシルエットが似合う"],
    emoji: "🌿",
  },
};

// ─── カラー診断 ───────────────────────────────────────────
export const COLOR_SEASON_INFO: Record<ColorSeason, {
  name: string;
  description: string;
  bestColors: string[];
  bestColorHexes: string[];
  avoidColors: string[];
  emoji: string;
}> = {
  spring: {
    name: "スプリング",
    description: "明るく鮮やかな色が似合う、フレッシュで可愛らしいタイプ。",
    bestColors: ["コーラルピンク", "ピーチ", "ライトイエロー", "アイボリー", "ライムグリーン"],
    bestColorHexes: ["#FF6B6B", "#FFB347", "#FFE66D", "#FFF8E7", "#B5EAD7"],
    avoidColors: ["黒", "ネイビー", "グレー"],
    emoji: "🌸",
  },
  summer: {
    name: "サマー",
    description: "青みがかったソフトな色が似合う、クールで上品なタイプ。",
    bestColors: ["ラベンダー", "スカイブルー", "ローズピンク", "ミントグリーン", "ソフトホワイト"],
    bestColorHexes: ["#C8A8E9", "#87CEEB", "#FFB6C1", "#98D8C8", "#F0F0F0"],
    avoidColors: ["オレンジ", "イエロー", "濃いブラウン"],
    emoji: "❄️",
  },
  autumn: {
    name: "オータム",
    description: "温かみのある深みのある色が似合う、大人っぽく落ち着いたタイプ。",
    bestColors: ["テラコッタ", "カーキ", "マスタード", "ブリック", "オリーブ"],
    bestColorHexes: ["#C0392B", "#7D7C42", "#F0A500", "#8B3A3A", "#6B7C3A"],
    avoidColors: ["パステルカラー", "ビビッドピンク", "ライトブルー"],
    emoji: "🍂",
  },
  winter: {
    name: "ウィンター",
    description: "コントラストの強い色やビビッドカラーが似合う、スタイリッシュなタイプ。",
    bestColors: ["ロイヤルブルー", "ビビッドレッド", "ブラック", "ホワイト", "ホットピンク"],
    bestColorHexes: ["#1A237E", "#C62828", "#212121", "#FFFFFF", "#E91E8C"],
    avoidColors: ["ベージュ", "オフホワイト", "くすみカラー"],
    emoji: "🌨️",
  },
};

// ─── 骨格×カラーの組み合わせウェア提案 ───────────────────────────────
export function getWearRecommendations(bodyType: BodyType, colorSeason: ColorSeason): {
  topPicks: { item: string; description: string; colorTip: string }[];
  silhouette: string;
  fabricTips: string[];
  avoidItems: string[];
} {
  const bodyInfo = BODY_TYPE_INFO[bodyType];
  const colorInfo = COLOR_SEASON_INFO[colorSeason];

  const silhouetteMap: Record<BodyType, string> = {
    straight: "タイトフィットのウェア・Vネック・シンプルなデザイン",
    wave: "フレアスカート・フィット＆フレア・フリル付きデザイン",
    natural: "ゆったりとしたTシャツ・オーバーサイズ・ロゴ入り",
  };

  const fabricMap: Record<BodyType, string[]> = {
    straight: ["ドライフィット素材", "薄手のポリエステル", "伸縮性の高い素材"],
    wave: ["柔らかいジャージ素材", "シフォン混合素材", "軽量なニット"],
    natural: ["綿混合素材", "リネン混合", "厚みのあるジャージ"],
  };

  const topPicksMap: Record<BodyType, Record<ColorSeason, { item: string; description: string; colorTip: string }[]>> = {
    straight: {
      spring: [
        { item: "ナイキ コートドライフィットTシャツ", description: "体のラインを活かすフィット感", colorTip: `${colorInfo.bestColors[0]}や${colorInfo.bestColors[1]}がおすすめ` },
        { item: "アディダス クラブテニスドレス", description: "タイトシルエットで上品に", colorTip: `${colorInfo.bestColors[2]}のワンカラーコーデで明るく` },
        { item: "ユニクロ ドライEXポロシャツ", description: "シンプルなデザインで清楚感", colorTip: "アイボリー×コーラルのコーデが◎" },
      ],
      summer: [
        { item: "ナイキ コートドライフィットTシャツ", description: "すっきりしたネックラインが美しい", colorTip: `${colorInfo.bestColors[0]}や${colorInfo.bestColors[2]}が映える` },
        { item: "ウィルソン テニスドレス", description: "クールな印象で上品に", colorTip: "ラベンダー×ホワイトの組み合わせが上品" },
        { item: "ルコック テニスポロ", description: "フレンチシックな雰囲気に", colorTip: "ソフトなパステルトーンで統一" },
      ],
      autumn: [
        { item: "ヨネックス ゲームシャツ", description: "シャープなシルエットが決まる", colorTip: `${colorInfo.bestColors[0]}や${colorInfo.bestColors[2]}でリッチな雰囲気` },
        { item: "ラコステ テニスポロ", description: "タイムレスなクラシックデザイン", colorTip: "テラコッタ×カーキのコーデがオシャレ" },
        { item: "フィラ テニスドレス", description: "ボディラインが美しく見える", colorTip: "マスタード単色でインパクトを" },
      ],
      winter: [
        { item: "ナイキ NikeCourt Air Zoom", description: "コントラストを活かしたデザイン", colorTip: `${colorInfo.bestColors[3]}や${colorInfo.bestColors[0]}でモードに` },
        { item: "アディダス プライムブルーテニスドレス", description: "クリーンでエッジの効いたシルエット", colorTip: "白黒バイカラーで最強コーデ" },
        { item: "ウィルソン Team Polo", description: "シンプルさが際立つ", colorTip: "ブラック×ホワイトで決める" },
      ],
    },
    wave: {
      spring: [
        { item: "バボラ フレアスカート付きテニスウェア", description: "揺れるフレアがフェミニンな印象", colorTip: `${colorInfo.bestColors[0]}フレアで可愛らしく` },
        { item: "ウィルソン テニスドレス（フリル付き）", description: "柔らかなラインが似合う", colorTip: "パステルカラーのドレスで一体感" },
        { item: "ナイキ コートビクトリーフルジップ", description: "スリムラインで動きやすく", colorTip: "コーラルピンクのウェアでキュートに" },
      ],
      summer: [
        { item: "アシックス テニスドレス", description: "ソフトな素材感が体に馴染む", colorTip: `${colorInfo.bestColors[1]}ベースで清楚に` },
        { item: "ルコック フレアスカート", description: "揺れるシルエットで華やかさUP", colorTip: "ラベンダー×ホワイトで夏らしく" },
        { item: "ヘッドドレス（薄手素材）", description: "柔らかい素材で体を優しく包む", colorTip: "ミントグリーンで爽やかに" },
      ],
      autumn: [
        { item: "フィラ テニスドレス（柔らか素材）", description: "しなやかな動きが引き立つ", colorTip: `${colorInfo.bestColors[3]}ドレスで女性らしく` },
        { item: "バボラ テニススカート", description: "フレアラインで柔らかい印象", colorTip: "オリーブ×テラコッタのコーデが大人っぽい" },
        { item: "ウィルソン フェミニンシャツ", description: "ふわっとした素材感が魅力", colorTip: "マスタード単色でビンテージ感" },
      ],
      winter: [
        { item: "ナイキ テニスドレス（スリム）", description: "シャープさの中にフェミニンさが光る", colorTip: `${colorInfo.bestColors[4]}で大胆に` },
        { item: "アディダス スカート付きウェア", description: "モノトーンで上品にまとめる", colorTip: "白×黒でクールエレガントに" },
        { item: "K-Swiss テニスウェア", description: "クリーンなラインが際立つ", colorTip: "ロイヤルブルー×白でビビッドに" },
      ],
    },
    natural: {
      spring: [
        { item: "ナイキ テニスTシャツ（オーバーサイズ）", description: "ゆったりしたシルエットが自然体でオシャレ", colorTip: `${colorInfo.bestColors[4]}のリラックスコーデで" ` },
        { item: "アディダス フリーリフト Tシャツ", description: "骨格の存在感をナチュラルに活かす", colorTip: "ライムグリーン×アイボリーで明るく" },
        { item: "ユニクロ UVカットパーカー", description: "ゆとりのあるシルエットで自然体に", colorTip: "ピーチ系でやわらかな春カラーを" },
      ],
      summer: [
        { item: "ナイキ ドライフィットTシャツ（ゆとり）", description: "さらっと着こなす自然体スタイル", colorTip: `${colorInfo.bestColors[2]}でクールに` },
        { item: "アシックス テニスTシャツ", description: "ロゴが映えるゆとりシルエット", colorTip: "スカイブルー×ホワイトで爽やかに" },
        { item: "ウィルソン ゆったりシャツ", description: "動きやすく自然体で着こなせる", colorTip: "ソフトカラーでまとめて上品に" },
      ],
      autumn: [
        { item: "ヨネックス テニスジャケット", description: "骨格の存在感を活かすスポーティな一着", colorTip: `${colorInfo.bestColors[4]}ベースでアウトドア感` },
        { item: "ラコステ ポロシャツ（ゆったり）", description: "クラシックでゆとりあるスタイル", colorTip: "カーキ×マスタードでアーシーに" },
        { item: "ナイキ クラブTシャツ（オーバーサイズ）", description: "ストリートとスポーツを融合", colorTip: "テラコッタ×オリーブが旬コーデ" },
      ],
      winter: [
        { item: "ナイキ テックフリースジャケット", description: "存在感のあるシルエットでインパクト大", colorTip: `${colorInfo.bestColors[2]}のジャケットでモードに` },
        { item: "アディダス オーバーサイズTシャツ", description: "ゆとりのあるシルエットがクール", colorTip: "ブラック×ホワイトのモノトーンで決める" },
        { item: "K-Swiss クラシックTシャツ", description: "ロゴのある存在感あるコーデ", colorTip: "ロイヤルブルー×白で爽快に" },
      ],
    },
  };

  return {
    topPicks: topPicksMap[bodyType][colorSeason],
    silhouette: silhouetteMap[bodyType],
    fabricTips: fabricMap[bodyType],
    avoidItems: colorInfo.avoidColors.map(c => `${c}のウェア`),
  };
}

// ─── 骨格診断の質問 ───────────────────────────────────────────
export const BODY_TYPE_QUESTIONS = [
  {
    id: "q1",
    question: "首・肩のラインはどちらに近いですか？",
    options: [
      { label: "首が短め・肩幅がしっかりある", value: "straight", image: "⬆️" },
      { label: "首が長め・なで肩気味", value: "wave", image: "〰️" },
      { label: "肩の骨が出ている・鎖骨が目立つ", value: "natural", image: "🌿" },
    ],
  },
  {
    id: "q2",
    question: "体の質感はどちらに近いですか？",
    options: [
      { label: "筋肉質・ハリとコシがある", value: "straight", image: "💪" },
      { label: "脂肪が柔らかく・やや薄め", value: "wave", image: "🌊" },
      { label: "骨感がある・フレームがしっかり", value: "natural", image: "🦴" },
    ],
  },
  {
    id: "q3",
    question: "着こなしが一番しっくりくるのは？",
    options: [
      { label: "シンプルでタイトなデザイン", value: "straight", image: "👔" },
      { label: "フリルやフレアなど柔らかいデザイン", value: "wave", image: "👗" },
      { label: "ゆったりとしたオーバーサイズ", value: "natural", image: "👕" },
    ],
  },
  {
    id: "q4",
    question: "胸・ウエスト・ヒップのバランスはどちらですか？",
    options: [
      { label: "上半身に厚みがあり、メリハリがある", value: "straight", image: "🔷" },
      { label: "全体的に薄く、腰の位置が低め", value: "wave", image: "🔵" },
      { label: "腰の位置が高く、骨盤が大きめ", value: "natural", image: "🍀" },
    ],
  },
  {
    id: "q5",
    question: "膝・手足の関節について当てはまるのは？",
    options: [
      { label: "目立たず、全体的に滑らか", value: "straight", image: "✨" },
      { label: "膝が丸く、手首・足首が細い", value: "wave", image: "🌀" },
      { label: "膝や関節が大きく、骨っぽい", value: "natural", image: "🦵" },
    ],
  },
  {
    id: "q6",
    question: "テニスウェアを選ぶとき、どんな悩みがありますか？",
    options: [
      { label: "フィット感が重要で、ゆるいと似合わない", value: "straight", image: "🎯" },
      { label: "ペラペラした素材は似合わず、柔らかい素材が好き", value: "wave", image: "🪶" },
      { label: "タイトすぎると骨感が目立ちすぎる", value: "natural", image: "🌱" },
    ],
  },
];

// ─── カラー診断の質問 ───────────────────────────────────────────
export const COLOR_SEASON_QUESTIONS = [
  {
    id: "c1",
    question: "肌の色はどちらに近いですか？",
    options: [
      { label: "明るく透明感のある肌・黄み寄り", value: "spring", color: "#FFE4C4" },
      { label: "ピンク系・青み寄り・色白", value: "summer", color: "#FFB6C1" },
      { label: "健康的で暗め・黄み寄り", value: "autumn", color: "#DEB887" },
      { label: "青白い・または色黒・コントラストが強い", value: "winter", color: "#F0F0F0" },
    ],
  },
  {
    id: "c2",
    question: "似合うと言われる色はどれに近いですか？",
    options: [
      { label: "コーラル・ピーチ・明るいイエロー", value: "spring", color: "#FF6B6B" },
      { label: "ラベンダー・ローズ・ソフトブルー", value: "summer", color: "#C8A8E9" },
      { label: "テラコッタ・カーキ・マスタード", value: "autumn", color: "#C0392B" },
      { label: "ビビッドレッド・ロイヤルブルー・ブラック", value: "winter", color: "#1A237E" },
    ],
  },
  {
    id: "c3",
    question: "アクセサリーはどちらが似合いますか？",
    options: [
      { label: "ゴールド（明るい）・珊瑚・アイボリー", value: "spring", color: "#FFD700" },
      { label: "シルバー・ローズゴールド・パール", value: "summer", color: "#C0C0C0" },
      { label: "アンティークゴールド・ブロンズ", value: "autumn", color: "#CD7F32" },
      { label: "プラチナ・シルバー・クリスタル", value: "winter", color: "#E8E8E8" },
    ],
  },
  {
    id: "c4",
    question: "白いウェアを着たとき、どんな印象になりますか？",
    options: [
      { label: "顔が明るく見え、フレッシュな印象になる", value: "spring", color: "#FFFACD" },
      { label: "肌が白く見え、上品・清楚な印象になる", value: "summer", color: "#F0F8FF" },
      { label: "肌が暗く見えて、顔色が冴えない", value: "autumn", color: "#FFF8DC" },
      { label: "コントラストが映え、スタイリッシュな印象になる", value: "winter", color: "#FFFFFF" },
    ],
  },
  {
    id: "c5",
    question: "苦手な色・似合わないと感じる色は？",
    options: [
      { label: "黒・紺など暗い色は重たく見える", value: "spring", color: "#696969" },
      { label: "オレンジ・イエロー・濃い茶は派手すぎる", value: "summer", color: "#FFA500" },
      { label: "パステルピンクや水色はぼやけた印象に", value: "autumn", color: "#B0E0E6" },
      { label: "ベージュやオフホワイトはぼんやりして見える", value: "winter", color: "#F5F5DC" },
    ],
  },
  {
    id: "c6",
    question: "テニスウェアのカラーで、よく選ぶ・選びたい系統は？",
    options: [
      { label: "明るくビタミンカラー・フレッシュ系", value: "spring", color: "#FF8C00" },
      { label: "スモーキー・くすみカラー・パステル系", value: "summer", color: "#9FB1C9" },
      { label: "アースカラー・深みのある自然系", value: "autumn", color: "#8B6914" },
      { label: "モノトーン・ビビッド・高コントラスト系", value: "winter", color: "#2F2F2F" },
    ],
  },
];
