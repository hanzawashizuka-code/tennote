import { TennisBackground } from "@/components/layout/tennis-background";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TennisBackground />
      <main className="flex min-h-dvh items-center justify-center p-4">
        {children}
      </main>
    </>
  );
}
