export function TennisBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 court-bg"
      aria-hidden="true"
    >
      {/* Court line overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px"
        }}
      />
      {/* Yellow accent glow top-right */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#C8F400]/30 blur-3xl pointer-events-none" />
      {/* White glow bottom-left */}
      <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-white/20 blur-3xl pointer-events-none" />
    </div>
  );
}
