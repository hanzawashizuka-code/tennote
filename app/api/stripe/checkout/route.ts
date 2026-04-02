import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/actions/billing";
import type { PlanKey } from "@/lib/stripe/config";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan, referralCode } = await req.json() as { plan: PlanKey; referralCode?: string };

  try {
    await createCheckoutSession(plan, referralCode);
  } catch (e) {
    if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
    return NextResponse.json({ error: "Checkout session creation failed" }, { status: 500 });
  }
}
