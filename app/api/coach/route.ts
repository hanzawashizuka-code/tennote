import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createClient } from "@/lib/supabase/server";
import { getDailyMessageCount } from "@/actions/coach";
import { COACH_SYSTEM_PROMPT } from "@/lib/anthropic/client";

export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // プラン確認
  const { data: sub } = await (supabase as any)
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan = sub?.plan ?? "free";

  // Free プランは1日5メッセージ制限
  if (plan === "free") {
    const count = await getDailyMessageCount(user.id);
    if (count >= 5) {
      return new Response(
        JSON.stringify({ error: "本日のメッセージ上限（5回）に達しました。Proプランにアップグレードして無制限に使いましょう。" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-opus-4-6"),
    system: COACH_SYSTEM_PROMPT,
    messages,
  });

  return result.toDataStreamResponse();
}
