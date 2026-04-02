import { createPortalSession } from "@/actions/billing";

export async function POST() {
  try {
    await createPortalSession();
  } catch (e) {
    if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
    return new Response(JSON.stringify({ error: "Failed to create portal session" }), { status: 500 });
  }
}
