import Link from "next/link";
import { Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProfileCard } from "@/components/profile/profile-card";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!profile) return <div className="text-gray-400">プロフィールが見つかりません</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">プロフィール</h1>
        <Link href="/profile/settings">
          <Button variant="ghost" size="sm">
            <Settings size={16} />
            編集
          </Button>
        </Link>
      </div>
      <ProfileCard profile={profile} />
    </div>
  );
}
