import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "テニスAIコーチ",
  description: "AIがあなたのテニスをサポート。練習計画・大会情報・コミュニティ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-dvh flex flex-col">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(45, 106, 79, 0.9)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#f5ffe0",
            },
          }}
        />
      </body>
    </html>
  );
}
