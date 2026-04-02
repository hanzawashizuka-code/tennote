"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const schema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上です"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const fd = new FormData();
    fd.set("email", data.email);
    fd.set("password", data.password);
    const result = await login(fd);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  };

  return (
    <Card variant="strong" className="w-full max-w-sm mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">ログイン</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          ログイン
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-500">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="text-[#C8F400] hover:underline">
          新規登録
        </Link>
      </div>
    </Card>
  );
}
