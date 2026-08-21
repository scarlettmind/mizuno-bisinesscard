import type { Metadata } from "next";
import "./globals.css";
import "./button-theme.css";
import "./mobile-video-fix.css";

export const metadata: Metadata = {
  title: "Yuta Mizuno — airweave Digital Card",
  description: "Yuta Mizuno, Head of Business Development, Public Relations & President’s Office at airweave inc.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
