export const PLANS = {
  free: {
    name: "Free",
    priceJPY: 0,
    priceId: null,
    features: [
      "AIコーチ 1日5メッセージ",
      "フィード閲覧・投稿",
      "大会検索",
    ],
  },
  pro: {
    name: "Pro",
    priceJPY: 980,
    priceId: process.env.STRIPE_PRICE_ID_PRO!,
    features: [
      "AIコーチ 無制限",
      "フィード・DM全機能",
      "大会エントリー優先",
      "練習計画作成",
    ],
  },
  premium: {
    name: "Premium",
    priceJPY: 1980,
    priceId: process.env.STRIPE_PRICE_ID_PREMIUM!,
    features: [
      "Pro の全機能",
      "動画フォーム解析（近日公開）",
      "専属コーチマッチング",
      "大会結果自動記録",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
