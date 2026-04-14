import { Users, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMatchProfiles, respondMatchRequest } from "@/actions/matching";
import { MatchCard } from "@/components/matching/match-card";
import { MatchingSetupForm } from "@/components/matching/matching-setup-form";
import { Card } from "@/components/ui/card";

export default async function MatchingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 自分のマッチングプロフィール確認
  const { data: myProfile } = await (supabase as any)
    .from("match_profiles")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  // 届いたリクエスト
  const { data: requests } = await (supabase as any)
    .from("match_requests")
    .select("*, profiles!from_user_id(display_name, username, avatar_url, skill_level)")
    .eq("to_user_id", user!.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // 一覧取得
  const { data: profiles } = await getMatchProfiles({});

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Users size={22} className="text-[#1B4FD8]" />
          マッチング
        </h1>
      </div>

      {/* 届いたリクエスト */}
      {requests && requests.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#1B4FD8] mb-2">
            📬 マッチングリクエスト ({requests.length}件)
          </h2>
          <div className="flex flex-col gap-2">
            {requests.map((req) => (
              <PendingRequestCard key={req.id} request={req} />
            ))}
          </div>
        </div>
      )}

      {/* プロフィール設定 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1">
          <Settings size={14} /> あなたのマッチング設定
        </h2>
        <MatchingSetupForm existing={myProfile} />
      </div>

      {/* 一覧 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3">
          🎾 マッチング候補 ({profiles?.length ?? 0}人)
        </h2>
        {!profiles || profiles.length === 0 ? (
          <Card className="text-center py-10 text-gray-300 text-sm">
            まだマッチング登録しているユーザーがいません
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {profiles.map((p) => (
              <MatchCard key={p.user_id} profile={p as Parameters<typeof MatchCard>[0]["profile"]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PendingRequestCard({ request }: { request: { id: string; message: string | null; profiles: { display_name: string | null; username: string; avatar_url: string | null } } }) {
  return (
    <Card className="p-3 flex items-center gap-3">
      <div className="flex-1">
        <p className="text-gray-900 text-sm font-medium">
          {request.profiles.display_name ?? request.profiles.username} さんから申請
        </p>
        {request.message && (
          <p className="text-gray-400 text-xs mt-0.5">"{request.message}"</p>
        )}
      </div>
      <div className="flex gap-2">
        <form action={async () => { "use server"; await respondMatchRequest(request.id, "accepted"); }}>
          <button type="submit" className="text-xs bg-[#C8F400] text-[#0E1100] px-3 py-1.5 rounded-lg hover:bg-[#6B7F00] transition-all">
            承認
          </button>
        </form>
        <form action={async () => { "use server"; await respondMatchRequest(request.id, "declined"); }}>
          <button type="submit" className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200/60 transition-all">
            スキップ
          </button>
        </form>
      </div>
    </Card>
  );
}
