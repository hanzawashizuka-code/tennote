export function TennisBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 court-bg"
      aria-hidden="true"
    >
      {/* Soft yellow glow top-left */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#C8F400]/20 blur-3xl pointer-events-none" />
      {/* Soft yellow glow bottom-right */}
      <div className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full bg-[#C8F400]/15 blur-3xl pointer-events-none" />
    </div>
  );
}
