"use client";

import { useState } from "react";
import { PlanCard } from "@/components/billing/plan-card";
import { ReferralInput } from "@/components/billing/referral-input";
import { BillingPortalButton } from "@/components/billing/billing-portal-button";
import { useSubscription } from "@/hooks/use-subscription";
import { Spinner } from "@/components/ui/spinner";

export default function BillingPage() {
  const { plan, loading } = useSubscription();
  const [referralCode, setReferralCode] = useState("");

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">プラン</h1>
      <p className="text-gray-400 text-sm mb-5">
        現在のプラン: <span className="text-[#4A5C00] font-bold capitalize">{plan}</span>
      </p>

      {plan !== "free" && (
        <div className="mb-4">
          <BillingPortalButton />
        </div>
      )}

      <div className="mb-5">
        <ReferralInput onValid={setReferralCode} />
      </div>

      <div className="grid gap-4">
        <PlanCard planKey="free"    currentPlan={plan} />
        <PlanCard planKey="lite"    currentPlan={plan} referralCode={referralCode} />
        <PlanCard planKey="pro"     currentPlan={plan} referralCode={referralCode} />
        <PlanCard planKey="premium" currentPlan={plan} referralCode={referralCode} />
      </div>
    </div>
  );
}
