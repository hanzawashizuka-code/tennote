"use client";

import { useState } from "react";
import { toast } from "sonner";
import { enterEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";

interface EntryButtonProps {
  eventId: string;
  isEntered: boolean;
}

export function EntryButton({ eventId, isEntered: initialEntered }: EntryButtonProps) {
  const [entered, setEntered] = useState(initialEntered);
  const [loading, setLoading] = useState(false);

  const handleEntry = async () => {
    if (entered) return;
    setLoading(true);
    const result = await enterEvent(eventId);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      setEntered(true);
      toast.success("エントリーしました！");
    }
  };

  if (entered) {
    return (
      <Button variant="outline" disabled className="w-full">
        ✓ エントリー済み
      </Button>
    );
  }

  return (
    <Button onClick={handleEntry} loading={loading} size="lg" className="w-full">
      エントリーする
    </Button>
  );
}
