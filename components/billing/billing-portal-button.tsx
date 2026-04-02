"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createPortalSession } from "@/actions/billing";
import { Button } from "@/components/ui/button";

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await createPortalSession();
    } catch {
      toast.error("ポータルの起動に失敗しました");
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} loading={loading} variant="outline" size="sm">
      プランを管理・解約
    </Button>
  );
}
