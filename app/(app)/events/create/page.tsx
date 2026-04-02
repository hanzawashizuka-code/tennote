import { Trophy } from "lucide-react";
import { EventCreateForm } from "@/components/events/event-create-form";

export default function EventCreatePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy size={22} className="text-[#C8F400]" />
          大会・練習会を作成
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          あなたが主催するイベントを登録しましょう
        </p>
      </div>
      <EventCreateForm />
    </div>
  );
}
