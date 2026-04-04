"use client";
import { useState, useTransition } from "react";
import { CheckCircle, CreditCard, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { enterEvent } from "@/actions/events";

interface EntryButtonProps {
  eventId: string;
  isEntered: boolean;
  entryStatus: string | null;
  entryFee: number;
  isFull: boolean;
}

export function EntryButton({ eventId, isEntered: initialEntered, entryStatus, entryFee, isFull }: EntryButtonProps) {
  const [entered, setEntered] = useState(initialEntered);
  const [isPending, startTransition] = useTransition();

  const handleEntry = () => {
    if (entered || isFull) return;
    startTransition(async () => {
      const result = await enterEvent(eventId);
      if (result.error) {
        toast.error(result.error);
      } else if ((result as any).requiresPayment) {
        // Redirect to Stripe checkout
        const { createEventCheckout } = await import("@/actions/billing");
        const checkoutResult = await createEventCheckout(eventId, (result as any).priceId);
        if (checkoutResult?.url) {
          window.location.href = checkoutResult.url;
        } else {
          toast.error("決済ページへの遷移に失敗しました");
        }
      } else if (result.success) {
        setEntered(true);
        toast.success("🎾 エントリーしました！");
      }
    });
  };

  if (entered) {
    return (
      <div className="bg-[#EEF6FF] border border-[#1B4FD8]/20 rounded-2xl p-4 flex items-center gap-3">
        <CheckCircle size={22} className="text-[#1B4FD8] flex-shrink-0" />
        <div>
          <p className="text-[#1B4FD8] font-bold text-sm">エントリー済み</p>
          <p className="text-[#1B4FD8]/70 text-xs">参加が確定しています</p>
        </div>
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
        <Users size={22} className="text-red-400 flex-shrink-0" />
        <div>
          <p className="text-red-600 font-bold text-sm">満員です</p>
          <p className="text-red-400 text-xs">定員に達しています</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleEntry}
      disabled={isPending}
      className="w-full py-4 rounded-2xl bg-[#1B4FD8] text-white font-bold text-base shadow-lg shadow-[#1B4FD8]/25 hover:bg-[#1B4FD8]/90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : entryFee > 0 ? (
        <>
          <CreditCard size={18} />
          {new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(entryFee)} で参加申込
        </>
      ) : (
        <>
          <Users size={18} />
          無料でエントリーする
        </>
      )}
    </button>
  );
}
