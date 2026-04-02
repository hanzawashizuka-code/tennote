import { createClient } from "@/lib/supabase/server";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { SettingsForm } from "@/components/profile/settings-form";
import { Card } from "@/components/ui/card";

export default async function ProfileSettingsPage() {
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
      <h1 className="text-xl font-bold text-gray-900 mb-4">プロフィール設定</h1>
      <Card variant="strong" className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <AvatarUpload currentUrl={profile.avatar_url} name={profile.display_name ?? profile.username} />
          <p className="text-gray-300 text-xs">タップして写真を変更</p>
        </div>
        <SettingsForm profile={profile} />
      </Card>
    </div>
  );
}
