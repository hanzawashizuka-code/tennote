export default function LogoPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Google Fonts for font preview */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Dancing+Script:wght@700&family=Pacifico&family=Oswald:wght@700&family=Space+Mono:wght@700&family=Abril+Fatface&family=Lobster&family=Satisfy&family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@1,700&display=swap"
        rel="stylesheet"
      />
      <main className="min-h-dvh bg-[#EEF6FF] px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </main>
    </>
  );
}
