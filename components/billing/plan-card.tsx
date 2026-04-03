"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { createCheckoutSession } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatJPY } from "@/lib/utils/format";
import type { PlanKey } from "@/lib/stripe/config";
import { PLANS } from "@/lib/stripe/config";

interface PlanCardProps {
  planKey: PlanKey;
  currentPlan: PlanKey;
  referralCode?: string;
}

export function PlanCard({ planKey, currentPlan, referralCode }: PlanCardProps) {
  const [loading, setLoading] = useState(false);
  const plan = PLANS[planKey];
  const isCurrent = currentPlan === planKey;
  const isPaid = planKey !== "free";
  const isRecommended = planKey === "pro";

  const handleSubscribe = async () => {
    if (!isPaid || isCurrent) return;
    setLoading(true);
    try {
      await createCheckoutSession(planKey, referralCode);
    } catch {
      toast.error("エラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <Card
      variant={isRecommended ? "strong" : "default"}
      className={`relative ${isRecommended ? "ring-2 ring-[#C8F400]" : ""}`}
    >
      {/* バッジ */}
      {plan.badge && (
        <div className="absolute -top-3 left-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            isRecommended
              ? "bg-[#C8F400] text-[#0E1100]"
              : "bg-gray-900 text-white"
          }`}>
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-4 mt-1">
        <h3 className="text-gray-900 font-bold text-lg">{plan.name}</h3>
        <div className="mt-1 flex items-baseline gap-1">
          {plan.priceJPY === 0 ? (
            <span className="text-2xl font-black text-gray-900">無料</span>
          ) : (
            <>
              <span className="text-2xl font-black text-gray-900">{formatJPY(plan.priceJPY)}</span>
              <span className="text-gray-400 text-sm">/月</span>
            </>
          )}
        </div>
        {referralCode && isPaid && currentPlan === "free" && (
          <p className="text-[#4A5C00] text-xs mt-1 font-semibold">🎉 初月10%割引適用</p>
        )}
      </div>

      <ul className="flex flex-col gap-2 mb-5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
            <Check size={14} className="text-[#C8F400] flex-shrink-0 mt-0.5" strokeWidth={3} />
            {f}
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <Button variant="outline" disabled className="w-full">✓ 現在のプラン</Button>
      ) : planKey === "free" ? (
        <Button variant="ghost" disabled className="w-full text-gray-400">ダウングレード</Button>
      ) : (
        <Button
          onClick={handleSubscribe}
          loading={loading}
          className="w-full"
          variant={isRecommended ? "primary" : "outline"}
        >
          {plan.name}にアップグレード
        </Button>
      )}
    </Card>
  );
}
