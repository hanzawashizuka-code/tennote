import { createClient } from "@/lib/supabase/server";
import { PostComposer } from "@/components/feed/post-composer";
import { FeedList } from "@/components/feed/feed-list";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts } = await (supabase as any)
    .from("posts")
    .select("*, profiles(display_name, username, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: likes } = await (supabase as any)
    .from("post_likes")
    .select("post_id")
    .eq("user_id", user!.id);

  const likedPostIds = likes?.map((l) => l.post_id) ?? [];

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">フィード</h1>
      <PostComposer />
      <FeedList
        initialPosts={(posts ?? []) as Parameters<typeof FeedList>[0]["initialPosts"]}
        currentUserId={user!.id}
        likedPostIds={likedPostIds}
      />
    </div>
  );
}
