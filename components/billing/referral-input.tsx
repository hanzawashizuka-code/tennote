"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { validateReferralCode } from "@/actions/billing";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ReferralInputProps {
  onValid: (code: string) => void;
}

export function ReferralInput({ onValid }: ReferralInputProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [referrerName, setReferrerName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!code.trim()) return;
    setLoading(true);
    const result = await validateReferralCode(code);
    setLoading(false);

    if (result.valid) {
      setStatus("valid");
      setReferrerName(result.referrerName ?? "");
      onValid(code.toUpperCase());
    } else {
      setStatus("invalid");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">紹介コード（任意・初月10%割引）</label>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setStatus("idle"); }}
          placeholder="XXXXXXXX"
          maxLength={10}
          className="flex-1 h-10 rounded-xl bg-gray-100 border border-gray-200 px-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#C8F400] font-mono text-sm tracking-wider"
        />
        <Button onClick={handleCheck} loading={loading} size="sm" variant="outline" disabled={!code.trim()}>
          確認
        </Button>
      </div>
      {status === "valid" && (
        <p className="flex items-center gap-1 text-green-400 text-xs">
          <CheckCircle size={12} />
          {referrerName}さんの紹介コードを適用します
        </p>
      )}
      {status === "invalid" && (
        <p className="flex items-center gap-1 text-red-400 text-xs">
          <XCircle size={12} />
          無効な紹介コードです
        </p>
      )}
    </div>
  );
}
