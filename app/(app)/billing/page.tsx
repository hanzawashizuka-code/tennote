"use client";
import { useState } from "react";
import { CreditCard, Star, Zap, Crown, CheckCircle } from "lucide-react";
import { PlanCard } from "@/components/billing/plan-card";
import { ReferralInput } from "@/components/billing/referral-input";
import { BillingPortalButton } from "@/components/billing/billing-portal-button";
import { useSubscription } from "@/hooks/use-subscription";
import { Spinner } from "@/components/ui/spinner";

const PLAN_ICONS: Record<string, any> = {
  free: Star, lite: Zap, pro: CreditCard, premium: Crown,
};

const PLAN_NAMES_JA: Record<string, string> = {
  free: "フリー", lite: "ライト", pro: "プロ", premium: "プレミアム"
};

export default function BillingPage() {
  const { plan, loading } = useSubscription();
  const [referralCode, setReferralCode] = useState("");

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  const PlanIcon = PLAN_ICONS[plan] ?? Star;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 mb-1">
          <CreditCard size={22} className="text-[#1B4FD8]" />
          プラン・課金
        </h1>
        <p className="text-gray-400 text-sm">あなたの成長を加速させるプランを選びましょう</p>
      </div>

      {/* Current plan badge */}
      <div className="bg-white rounded-2xl border border-blue-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#EEF6FF] flex items-center justify-center">
          <PlanIcon size={20} className="text-[#1B4FD8]" />
        </div>
        <div>
          <p className="text-xs text-gray-400">現在のプラン</p>
          <p className="text-gray-900 font-black text-lg">{PLAN_NAMES_JA[plan] ?? plan}</p>
        </div>
        {plan !== "free" && (
          <div className="ml-auto">
            <BillingPortalButton />
          </div>
        )}
      </div>

      {/* Referral code */}
      <div>
        <p className="text-sm font-bold text-gray-700 mb-2">紹介コード（10% OFF）</p>
        <ReferralInput onValid={setReferralCode} />
      </div>

      {/* Plan cards */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-gray-700">プランを選ぶ</p>
        <PlanCard planKey="free"    currentPlan={plan} />
        <PlanCard planKey="lite"    currentPlan={plan} referralCode={referralCode} />
        <PlanCard planKey="pro"     currentPlan={plan} referralCode={referralCode} />
        <PlanCard planKey="premium" currentPlan={plan} referralCode={referralCode} />
      </div>

      {/* Features comparison hint */}
      <div className="bg-[#EEF6FF] rounded-2xl p-4">
        <p className="text-xs font-bold text-[#1B4FD8] mb-2">プランの違い</p>
        <div className="flex flex-col gap-1.5">
          {[
            { plan: "フリー",    feature: "AIコーチ 5メッセージ/日" },
            { plan: "ライト",    feature: "AIコーチ 20メッセージ/日 + 動画解析" },
            { plan: "プロ",      feature: "AIコーチ 無制限 + ライブ配信" },
            { plan: "プレミアム", feature: "全機能 + 優先サポート" },
          ].map(({ plan: p, feature }) => (
            <div key={p} className="flex items-center gap-2">
              <CheckCircle size={13} className="text-[#1B4FD8] flex-shrink-0" />
              <span className="text-xs text-gray-600"><span className="font-semibold">{p}</span>: {feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
