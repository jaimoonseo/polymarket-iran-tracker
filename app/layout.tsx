import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iran War Predictions - Polymarket Tracker",
  description: "Real-time tracking of Iran-US conflict predictions on Polymarket",
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
