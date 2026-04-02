"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const schema = z.object({
  username: z.string().min(2, "2文字以上で入力してください").max(30, "30文字以内で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上です"),
});

type FormData = z.infer<typeof schema>;

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const fd = new FormData();
    fd.set("username", data.username);
    fd.set("email", data.email);
    fd.set("password", data.password);
    const result = await signup(fd);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      setDone(true);
      toast.success(result.success);
    }
  };

  if (done) {
    return (
      <Card variant="strong" className="w-full max-w-sm mx-auto p-6 animate-fade-in text-center">
        <div className="text-4xl mb-3">📧</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">確認メールを送信しました</h2>
        <p className="text-gray-500 text-sm">メールのリンクをクリックしてアカウントを有効化してください。</p>
        <Link href="/login" className="mt-4 inline-block text-[#C8F400] hover:underline text-sm">
          ログインページへ
        </Link>
      </Card>
    );
  }

  return (
    <Card variant="strong" className="w-full max-w-sm mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">新規登録</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="username"
          label="ユーザー名"
          placeholder="tennis_player"
          error={errors.username?.message}
          {...register("username")}
        />
        <Input
          id="email"
          label="メールアドレス"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="password"
          label="パスワード"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" loading={loading} size="lg" className="mt-2">
          アカウント作成
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-500">
        既にアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-[#C8F400] hover:underline">
          ログイン
        </Link>
      </div>
    </Card>
  );
}
