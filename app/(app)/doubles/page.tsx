export const dynamic = "force-dynamic";
import { Shuffle } from "lucide-react";
import { DoublesGenerator } from "@/components/doubles/doubles-generator";

export default function DoublesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Shuffle size={22} className="text-[#1B4FD8]" />
          ダブルス乱数表
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          ランダムにペアを組んで、被りなしのゲーム順を生成します
        </p>
      </div>
      <DoublesGenerator />
    </div>
  );
}
