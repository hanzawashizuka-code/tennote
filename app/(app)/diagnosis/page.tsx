import Link from "next/link";
import { Brain, Shirt, ChevronRight } from "lucide-react";

export default function DiagnosisPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">診断メニュー</h1>
        <p className="text-gray-500 text-sm mt-1">あなたに合ったテニスライフを発見しよう</p>
      </div>

      <div className="flex flex-col gap-3">

        {/* MBTI */}
        <Link href="/diagnosis/mbti">
          <div className="group flex items-center gap-4 bg-white rounded-2xl p-5 border border-blue-100 hover:border-[#1B4FD8] hover:shadow-lg hover:shadow-blue-100 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF6FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1B4FD8] transition-colors">
              <Brain size={28} className="text-[#1B4FD8] group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-gray-900 font-bold text-base">MBTIプレースタイル診断</h2>
              <p className="text-gray-500 text-sm mt-0.5">あなたの性格から最適なプレースタイルを診断</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-blue-50 text-[#1B4FD8] font-semibold px-2.5 py-1 rounded-full">20問</span>
                <span className="text-xs text-gray-400">約5分</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-[#1B4FD8] flex-shrink-0 transition-colors" />
          </div>
        </Link>

        {/* ウェア診断 */}
        <Link href="/diagnosis/style">
          <div className="group flex items-center gap-4 bg-white rounded-2xl p-5 border border-blue-100 hover:border-[#1B4FD8] hover:shadow-lg hover:shadow-blue-100 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF6FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1B4FD8] transition-colors">
              <Shirt size={28} className="text-[#1B4FD8] group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-gray-900 font-bold text-base">テニスウェア診断</h2>
              <p className="text-gray-500 text-sm mt-0.5">骨格診断×パーソナルカラーで似合うウェアを提案</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-blue-50 text-[#1B4FD8] font-semibold px-2.5 py-1 rounded-full">12問</span>
                <span className="text-xs text-gray-400">約3分</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-[#1B4FD8] flex-shrink-0 transition-colors" />
          </div>
        </Link>

      </div>
    </div>
  );
}
