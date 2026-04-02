export interface MBTIResult {
  type: string;
  playStyle: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  recommendedDrills: string[];
  famousPlayers: string[];
  emoji: string;
  courtPosition: string;
  mentalTip: string;
}

export const MBTI_RESULTS: Record<string, MBTIResult> = {
  ENTJ: { type: "ENTJ", playStyle: "支配型オールラウンダー", description: "コートを支配するリーダータイプ。攻撃的なプレーで相手を圧倒します。戦略眼が鋭く、相手の弱点を素早く見抜いて攻めます。", strengths: ["強力なサーブ", "積極的なネットプレー", "高いメンタル強度", "局面判断の速さ"], weaknesses: ["プレッシャー下での焦り", "守備的なラリーの持続", "連続ミスへの怒り"], recommendedDrills: ["サーブ＆ボレー練習", "アプローチショット強化", "ポイント間のルーティン作り"], famousPlayers: ["ノバク・ジョコビッチ", "アンディ・マレー"], emoji: "👑", courtPosition: "ベースライン〜ネット両方", mentalTip: "ポイントを失っても「次の戦略」に素早く切り替えましょう" },
  ENTP: { type: "ENTP", playStyle: "創造型戦略家", description: "予測不能な戦術で相手を翻弄するアイデアマン。試合中に戦術を変え続け、相手を混乱させます。", strengths: ["多彩なショット", "戦術の柔軟性", "試合を読む力", "プレッシャーへの強さ"], weaknesses: ["集中力の維持", "基礎練習の継続", "ミスが続いたときのリズム崩れ"], recommendedDrills: ["ドロップショット練習", "スライス強化", "コース打ち分け", "サーブバリエーション"], famousPlayers: ["ニック・キリオス", "ジョン・マッケンロー"], emoji: "🎭", courtPosition: "ベースライン中心、時にネット", mentalTip: "アイデアを試しすぎず、ここぞという場面で使いましょう" },
  ENFJ: { type: "ENFJ", playStyle: "チームプレーヤー型", description: "ダブルスで真価を発揮。パートナーとの連携を大切にし、場の雰囲気をコントロールします。", strengths: ["ダブルス連携", "冷静な判断", "安定したラリー", "相手の心理を読む力"], weaknesses: ["シングルスでの孤独感", "相手の強さに引っ張られる", "自己犠牲しすぎる傾向"], recommendedDrills: ["ダブルスポジション練習", "ボレー強化", "コミュニケーション向上", "アイコンタクト練習"], famousPlayers: ["マルチナ・ナブラチロワ", "ボブ・ブライアン"], emoji: "🤝", courtPosition: "ネット重視（ダブルス）", mentalTip: "自分のゾーンを守ることがチームを助けることになります" },
  ENFP: { type: "ENFP", playStyle: "情熱型アタッカー", description: "感情でプレーするエンターテイナー。観客を魅了するプレーが得意で、感情が乗ったときは無双状態になります。", strengths: ["爆発的な瞬発力", "感情に乗ったプレー", "コート上の存在感", "大舞台での強さ"], weaknesses: ["感情コントロール", "長期戦での集中", "ルーティンの欠如"], recommendedDrills: ["フォアハンド強化", "メンタルリセット練習", "ウィナー練習", "呼吸法"], famousPlayers: ["ガエル・モンフィス", "ファビオ・フォニーニ"], emoji: "🔥", courtPosition: "ベースライン攻撃型", mentalTip: "感情のエネルギーをコントロールし、ポジティブなルーティンを作りましょう" },
  INTJ: { type: "INTJ", playStyle: "精密型戦略家", description: "データと計算に基づいた完璧な戦術を組み立てる分析家。相手を徹底研究し、弱点を突く精密なプレーをします。", strengths: ["精密なショット選択", "相手分析力", "長期戦の粘り", "自己改善意識の高さ"], weaknesses: ["突発的な状況への対応", "感情的なプレーヤーへの対策", "柔軟性に欠けることがある"], recommendedDrills: ["コース限定ラリー", "サービスゲーム分析", "動画フォーム確認", "相手分析メモ"], famousPlayers: ["ロジャー・フェデラー", "ビーナス・ウィリアムズ"], emoji: "🧮", courtPosition: "ベースライン精密型", mentalTip: "計画が崩れても即座に「プランB」を発動できる準備をしておきましょう" },
  INTP: { type: "INTP", playStyle: "理論派テクニシャン", description: "技術を徹底的に追求するテクニシャン。フォームの完璧さにこだわり、独創的なショットを開発します。", strengths: ["技術の習得力", "独創的なショット", "自己分析力", "フォームの精度"], weaknesses: ["試合での実践適用", "プレッシャー下での決断", "コンスタントな出力"], recommendedDrills: ["フォーム分析・動画撮影", "スライス多用練習", "一人打ち込み", "技術書・動画研究"], famousPlayers: ["スタン・ワウリンカ", "イワン・レンドル"], emoji: "🔬", courtPosition: "ベースライン技巧型", mentalTip: "考えすぎを防ぐため、試合中は「シンプルな判断基準」を1〜2つ決めておきましょう" },
  INFJ: { type: "INFJ", playStyle: "直感型ディフェンダー", description: "相手の動きを直感で読む守備の名手。粘り強いラリーと高い読みで相手をじわじわと追い詰めます。", strengths: ["相手を読む力", "粘り強いディフェンス", "冷静さ", "ロングラリーの安定感"], weaknesses: ["攻撃的な展開", "ミスへの引きずり", "攻守の切り替え"], recommendedDrills: ["ランニングショット", "ロブ・パッシング練習", "メンタル強化", "フィジカルトレーニング"], famousPlayers: ["ラファエル・ナダル（守備面）", "フアン・マルティン・デルポトロ"], emoji: "🛡️", courtPosition: "ベースライン守備型", mentalTip: "守備から攻撃への切り替えポイントを明確に持っておきましょう" },
  INFP: { type: "INFP", playStyle: "感性型アーティスト", description: "美しいテニスを追求する芸術家タイプ。独自のリズムを持ち、感性豊かなショットを放ちます。", strengths: ["独創的なショット", "マイペースな安定感", "長いラリー", "クリエイティブなプレー"], weaknesses: ["試合での積極性", "プレッシャー時の萎縮", "競争心の発揮"], recommendedDrills: ["クロスコートラリー", "トップスピン強化", "自由練習", "感覚を活かした練習"], famousPlayers: ["モニカ・セレス", "グスタボ・クエルテン"], emoji: "🎨", courtPosition: "ベースライン芸術型", mentalTip: "試合を「自分の世界観を表現する場」と捉えると力が出ます" },
  ESTJ: { type: "ESTJ", playStyle: "規律型ベースライナー", description: "練習を積み重ねた堅実なベースライナー。基礎を大切にし、ミスの少ない確実なプレーをします。", strengths: ["安定したストローク", "高い練習量", "試合の組み立て", "粘り強さ"], weaknesses: ["柔軟な戦術変更", "予測外のショット対応", "クリエイティブな展開"], recommendedDrills: ["クロス・ストレート打ち分け", "サーブ反復練習", "フットワーク", "ゲーム形式練習"], famousPlayers: ["リンゼイ・ダベンポート", "トーマス・ムスター"], emoji: "📐", courtPosition: "ベースライン堅実型", mentalTip: "「自分のテニス」を信じてルーティンを守り続けることが強みです" },
  ESTP: { type: "ESTP", playStyle: "瞬発型アタッカー", description: "瞬間的な判断と爆発力でポイントを取る。ネットプレーとリターンが得意なアグレッシブプレーヤー。", strengths: ["反射神経の高さ", "ネットプレー", "試合での度胸", "リターン力"], weaknesses: ["長期戦での安定", "戦術的思考", "忍耐力"], recommendedDrills: ["ネットダッシュ練習", "リターン強化", "リアクション練習", "ボレーボレー"], famousPlayers: ["ジョン・マッケンロー（ネット）", "パトリック・ラフター"], emoji: "⚡", courtPosition: "サーブ＆ボレー型", mentalTip: "流れを掴んだときは一気に畳み込む、失ったときは落ち着かせるスイッチを持ちましょう" },
  ESFJ: { type: "ESFJ", playStyle: "安定型サポーター", description: "場の空気を読みながら安定したプレー。ダブルスの名パートナーであり、チームに安心感をもたらします。", strengths: ["安定したラリー", "ダブルスの連携", "コートマナー", "精神的な支え"], weaknesses: ["攻撃的な局面", "相手の強打への対応", "自己主張の難しさ"], recommendedDrills: ["ダブルスフォーメーション", "ミスを減らす練習", "サーブ安定化", "ポーチ練習"], famousPlayers: ["クリス・エバート", "マルチナ・ヒンギス"], emoji: "💚", courtPosition: "ベースライン安定型", mentalTip: "相手に合わせすぎず、自分のゲームプランを持つことが大切です" },
  ESFP: { type: "ESFP", playStyle: "エンターテイナー型", description: "楽しみながらプレーするムードメーカー。観客を盛り上げ、自分も楽しみながら最高のパフォーマンスを発揮。", strengths: ["試合の楽しさ", "爆発的な瞬発力", "精神的なタフさ", "雰囲気作り"], weaknesses: ["集中力の持続", "プレッシャー下での安定", "一貫した戦術"], recommendedDrills: ["ゲーム形式の練習", "楽しめる打ち込み", "試合経験の積み重ね", "感情コントロール"], famousPlayers: ["アンドレ・アガシ", "ニック・キリオス（エンタメ面）"], emoji: "🎉", courtPosition: "ベースライン〜ネット自由型", mentalTip: "「楽しむ」という感覚が最高のパフォーマンスにつながります" },
  ISTJ: { type: "ISTJ", playStyle: "堅実型ディフェンダー", description: "コツコツ努力する堅実なプレーヤー。ミスの少ない安定したプレーと高い継続力が武器です。", strengths: ["ミスの少なさ", "継続的な努力", "規則正しい練習", "粘り強さ"], weaknesses: ["攻撃的なショット", "試合での冒険", "柔軟な応用"], recommendedDrills: ["ミスゼロのラリー練習", "フットワーク強化", "サーブ安定化", "データ記録"], famousPlayers: ["ミカエル・チャン", "ダビド・フェレール"], emoji: "🏗️", courtPosition: "ベースライン守り型", mentalTip: "積み上げた練習への信頼が試合での安心感を生みます" },
  ISTP: { type: "ISTP", playStyle: "冷静型テクニシャン", description: "冷静沈着に技術を駆使するクールなプレーヤー。感情に左右されず、技術で勝負します。", strengths: ["技術の多彩さ", "冷静な判断", "サーブ力", "クラッチ力"], weaknesses: ["感情を使ったプレー", "モチベーション管理", "ロングシーズンの維持力"], recommendedDrills: ["サーブ＆サービスゲーム", "スライス強化", "フォーム完成", "状況別練習"], famousPlayers: ["ペトラ・クビトバ", "マリン・チリッチ"], emoji: "🧊", courtPosition: "ベースライン技術型", mentalTip: "感情ではなく技術と状況判断で動く自分を信じましょう" },
  ISFJ: { type: "ISFJ", playStyle: "献身型ベースライナー", description: "相手に合わせて丁寧にプレーする献身的なプレーヤー。安定感と忍耐力が持ち味です。", strengths: ["安定したストローク", "相手への対応力", "忍耐強さ", "コートカバー力"], weaknesses: ["強気なショット", "積極的な攻撃", "先手を打つ勇気"], recommendedDrills: ["クロスラリー安定化", "ロブの精度向上", "ゲーム戦術", "攻撃へのトリガー設定"], famousPlayers: ["アナ・イバノビッチ", "フアン・カルロス・フェレーロ"], emoji: "🌸", courtPosition: "ベースライン丁寧型", mentalTip: "「ここで攻める」という明確なシチュエーションを事前に決めておきましょう" },
  ISFP: { type: "ISFP", playStyle: "感覚型アーティスト", description: "感覚を大切にする芸術的なテニスプレーヤー。美しいショットと独自のリズムが持ち味です。", strengths: ["感覚的なショットメイキング", "ドロップショット", "創造性", "リズムの良さ"], weaknesses: ["継続的な練習", "競争心の維持", "プレッシャー下の決断"], recommendedDrills: ["感覚重視の練習", "ドロップ＆ロブ", "自由な打ち込み", "音楽に合わせたリズム練習"], famousPlayers: ["マルセロ・リオス", "ガエル・モンフィス（感覚面）"], emoji: "🌈", courtPosition: "ベースライン感覚型", mentalTip: "自分のリズムを大切にし、そのリズムを崩されないよう意識しましょう" },
};

// ─── 20問MBTI質問（各軸5問）スコア制 ────────────────────────────────
export interface MBTIQuestion {
  id: string;
  axis: "EI" | "SN" | "TF" | "JP";
  question: string;
  optionA: { label: string; value: "E" | "S" | "T" | "J" };
  optionB: { label: string; value: "I" | "N" | "F" | "P" };
}

export const MBTI_QUESTIONS: MBTIQuestion[] = [
  // ── E/I 軸（5問）──────────────────────────
  {
    id: "EI1", axis: "EI",
    question: "試合で大事なポイントを取ったとき、あなたはどうしますか？",
    optionA: { label: "大きな声やガッツポーズで喜びを表現する", value: "E" },
    optionB: { label: "心の中で喜び、静かに次に集中する", value: "I" },
  },
  {
    id: "EI2", axis: "EI",
    question: "練習仲間との関係について、どちらが当てはまりますか？",
    optionA: { label: "にぎやかな練習が好きで、みんなで盛り上がりたい", value: "E" },
    optionB: { label: "少人数や一人の集中練習が落ち着く", value: "I" },
  },
  {
    id: "EI3", axis: "EI",
    question: "試合後の疲れの回復について、どちらに近いですか？",
    optionA: { label: "チームで食事や話し合いをすると回復する", value: "E" },
    optionB: { label: "一人でゆっくり過ごすと回復する", value: "I" },
  },
  {
    id: "EI4", axis: "EI",
    question: "コートでのコミュニケーションについて、どちらですか？",
    optionA: { label: "積極的に声を出し、相手や審判にも話しかける", value: "E" },
    optionB: { label: "必要最低限の会話で、プレーに集中する", value: "I" },
  },
  {
    id: "EI5", axis: "EI",
    question: "初めてのテニスコートや大会で、あなたはどちらですか？",
    optionA: { label: "すぐ周りの人と打ち解け、情報交換する", value: "E" },
    optionB: { label: "まず観察し、慣れてから自分のペースで動く", value: "I" },
  },

  // ── S/N 軸（5問）──────────────────────────
  {
    id: "SN1", axis: "SN",
    question: "練習で最も意識することはどちらですか？",
    optionA: { label: "フォームや足の位置など、具体的な動作の正確さ", value: "S" },
    optionB: { label: "試合全体の流れや戦術のイメージ", value: "N" },
  },
  {
    id: "SN2", axis: "SN",
    question: "コーチからアドバイスをもらうとき、どちらが嬉しいですか？",
    optionA: { label: "「ラケット面を○○度にして」という具体的な指示", value: "S" },
    optionB: { label: "「もっと相手の逆をつくイメージで」という大きな方向性", value: "N" },
  },
  {
    id: "SN3", axis: "SN",
    question: "テニスの上達のために、どちらを重視しますか？",
    optionA: { label: "基礎の反復練習を何百回もこなすこと", value: "S" },
    optionB: { label: "試合や実戦から感覚を掴んでいくこと", value: "N" },
  },
  {
    id: "SN4", axis: "SN",
    question: "試合中、頭の中で考えていることは？",
    optionA: { label: "「次はクロスに打つ」など具体的なプランが多い", value: "S" },
    optionB: { label: "「この試合の全体の流れ・相手のパターン」など大局的なこと", value: "N" },
  },
  {
    id: "SN5", axis: "SN",
    question: "新しいショットを習得するとき、どちらのやり方が合っていますか？",
    optionA: { label: "手順を一つひとつ確認しながら、着実に身につける", value: "S" },
    optionB: { label: "まず感覚でやってみて、あとから調整する", value: "N" },
  },

  // ── T/F 軸（5問）──────────────────────────
  {
    id: "TF1", axis: "TF",
    question: "試合に負けたとき、最初に考えることは？",
    optionA: { label: "なぜ負けたか、原因とデータを分析する", value: "T" },
    optionB: { label: "悔しい気持ちを整理し、気持ちを立て直す", value: "F" },
  },
  {
    id: "TF2", axis: "TF",
    question: "練習パートナーを選ぶとき、重視するのは？",
    optionA: { label: "自分の弱点を鍛えるのに最適なレベルや特性", value: "T" },
    optionB: { label: "一緒にいて楽しく、雰囲気が合うかどうか", value: "F" },
  },
  {
    id: "TF3", axis: "TF",
    question: "コーチや仲間からフィードバックをもらうとき、どちらを求めますか？",
    optionA: { label: "厳しくても率直な改善点の指摘", value: "T" },
    optionB: { label: "良い点を認めた上での優しいアドバイス", value: "F" },
  },
  {
    id: "TF4", axis: "TF",
    question: "相手選手の情報を得たとき、まず考えることは？",
    optionA: { label: "弱点・強みを分析して攻略プランを立てる", value: "T" },
    optionB: { label: "どんな選手か・試合スタイルのイメージを持つ", value: "F" },
  },
  {
    id: "TF5", axis: "TF",
    question: "試合中、ミスが続いたとき、どうしますか？",
    optionA: { label: "冷静に原因を考え、戦術を論理的に修正する", value: "T" },
    optionB: { label: "気持ちをリセットして感情をコントロールする", value: "F" },
  },

  // ── J/P 軸（5問）──────────────────────────
  {
    id: "JP1", axis: "JP",
    question: "大会前の準備はどちらに近いですか？",
    optionA: { label: "練習スケジュール・戦術・持ち物を事前に決めておく", value: "J" },
    optionB: { label: "大まかな方向性だけ決めて、当日の状況に合わせる", value: "P" },
  },
  {
    id: "JP2", axis: "JP",
    question: "試合の戦術について、どちらが当てはまりますか？",
    optionA: { label: "事前に決めた戦術を忠実に実行するのが好き", value: "J" },
    optionB: { label: "試合の流れを見ながら即興で戦術を変えるのが得意", value: "P" },
  },
  {
    id: "JP3", axis: "JP",
    question: "テニスの予定管理について、どちらに近いですか？",
    optionA: { label: "練習日・休日・試合を計画的に管理している", value: "J" },
    optionB: { label: "気分やチャンスに合わせて柔軟に決める", value: "P" },
  },
  {
    id: "JP4", axis: "JP",
    question: "サーブについて、どちらがあなたに近いですか？",
    optionA: { label: "コースと球種を事前に決めてから打つ", value: "J" },
    optionB: { label: "相手の構えを見てから直感でコースを決める", value: "P" },
  },
  {
    id: "JP5", axis: "JP",
    question: "試合で予想外のことが起きたとき（雨・遅延など）、どうなりますか？",
    optionA: { label: "計画が崩れてペースが乱れることがある", value: "J" },
    optionB: { label: "むしろ状況の変化に乗じてアドバンテージを取れる", value: "P" },
  },
];

export function calcMBTIType(answers: Record<string, "E"|"I"|"S"|"N"|"T"|"F"|"J"|"P">): string {
  const scores: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  Object.values(answers).forEach((v) => { scores[v] = (scores[v] ?? 0) + 1; });
  return [
    scores.E >= scores.I ? "E" : "I",
    scores.S >= scores.N ? "S" : "N",
    scores.T >= scores.F ? "T" : "F",
    scores.J >= scores.P ? "J" : "P",
  ].join("");
}

export function getMBTIScorePercent(answers: Record<string, string>, axis: string): { first: number; second: number; firstLabel: string; secondLabel: string } {
  const axisMap: Record<string, [string, string]> = {
    EI: ["E", "I"], SN: ["S", "N"], TF: ["T", "F"], JP: ["J", "P"],
  };
  const [a, b] = axisMap[axis];
  const total = Object.values(answers).filter(v => v === a || v === b).length;
  const countA = Object.values(answers).filter(v => v === a).length;
  const pctA = total > 0 ? Math.round((countA / total) * 100) : 50;
  return { first: pctA, second: 100 - pctA, firstLabel: a, secondLabel: b };
}
