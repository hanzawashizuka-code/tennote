import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { createClient } from "@/lib/supabase/server";

const VIDEO_SYSTEM_PROMPT = `あなたはJTAライセンスを持つ経験豊富なプロテニスコーチです。
選手の練習・試合動画のフレームを分析し、具体的で実践的なフィードバックを日本語で提供してください。

分析の際は以下の観点を含めてください：
- フォーム全体の評価（構え・スイング・フォロースルー）
- フットワークとポジショニング
- ラケットの使い方・インパクトポイント
- 改善点と優先順位
- 具体的な練習ドリルの提案

フレームは動画から均等に抽出されたものです。動きの流れを踏まえて総合的に分析してください。`;

export async function POST(req: Request) {
  try {
    // 認証チェック
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "未認証です" }, { status: 401 });

    const { frames, context, shotType } = await req.json();
    if (!frames || frames.length === 0) {
      return Response.json({ error: "フレームデータがありません" }, { status: 400 });
    }

    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

    const userText = [
      shotType ? `ショットの種類: ${shotType}` : "",
      context ? `選手からのメモ: ${context}` : "",
      `\n動画から抽出した${frames.length}フレームを分析してください。`,
    ].filter(Boolean).join("\n");

    const { text } = await generateText({
      model: anthropic("claude-opus-4-5") as any,
      system: VIDEO_SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: [
          ...frames.map((frame: string) => ({
            type: "image" as const,
            image: frame,
          })),
          { type: "text" as const, text: userText },
        ],
      }],
      maxTokens: 1500,
    });

    return Response.json({ analysis: text });
  } catch (err) {
    console.error("Video analysis error:", err);
    return Response.json({ error: "分析に失敗しました" }, { status: 500 });
  }
}
