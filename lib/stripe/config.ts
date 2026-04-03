export const PLANS = {
  free: {
    name: "Free",
    priceJPY: 0,
    priceId: null,
    badge: null,
    features: [
      "AIコーチ 1日5メッセージ",
      "フィード閲覧・投稿（写真のみ）",
      "大会検索",
      "MBTI・ウェア診断",
    ],
  },
  lite: {
    name: "Lite",
    priceJPY: 490,
    priceId: process.env.STRIPE_PRICE_ID_LITE!,
    badge: null,
    features: [
      "AIコーチ 1日20メッセージ",
      "フィード動画投稿",
      "練習相手マッチング",
      "トレーニングログ・バロメーター",
      "大会エントリー",
    ],
  },
  pro: {
    name: "Pro",
    priceJPY: 980,
    priceId: process.env.STRIPE_PRICE_ID_PRO!,
    badge: "人気",
    features: [
      "AIコーチ 無制限",
      "動画AI分析（無制限）",
      "DM 写真・動画添付",
      "フィジカルプログラム自動作成",
      "大会エントリー優先",
    ],
  },
  premium: {
    name: "Premium",
    priceJPY: 1980,
    priceId: process.env.STRIPE_PRICE_ID_PREMIUM!,
    badge: "最上位",
    features: [
      "Pro の全機能",
      "専属AIコーチ（個別カスタマイズ）",
      "週次パフォーマンスレポート",
      "コーチへの動画レビュー依頼（月5回）",
      "優先サポート",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
