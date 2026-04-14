import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BillingSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card variant="strong" className="text-center max-w-sm w-full">
        <div className="text-5xl mb-4">🎾</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ご登録ありがとうございます！</h1>
        <p className="text-gray-500 text-sm mb-6">
          プランが有効になりました。tenコーチで練習を始めましょう！
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/coach">
            <Button className="w-full">tenコーチを使う</Button>
          </Link>
          <Link href="/feed">
            <Button variant="ghost" className="w-full">フィードへ</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
