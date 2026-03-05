import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "폴리마켓 트래커 - 인기 예측 마켓",
  description: "폴리마켓의 인기 예측 마켓을 실시간으로 추적합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}
