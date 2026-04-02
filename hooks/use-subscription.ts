"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PlanKey } from "@/lib/stripe/config";

export function useSubscription() {
  const [plan, setPlan] = useState<PlanKey>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }

      supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single()
        .then(({ data }) => {
          if (data) setPlan(data.plan as PlanKey);
          setLoading(false);
        });
    });
  }, []);

  return { plan, loading };
}
