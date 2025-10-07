import type { Metadata } from "next";
import "../(client)/globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AI 사업계획서 - 관리자",
  description: "AI 사업계획서 관리자 페이지",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased bg-[#FBFCFD]">{children}</body>
    </html>
  );
}
