import type { Metadata } from "next";
import "./globals.css";
import "./button-theme.css";
import "./mobile-video-fix.css";

export const metadata: Metadata = {
  title: "Yuta Mizuno — airweave Digital Identity",
  description: "Connect with Yuta Mizuno, Manager of Business Development at airweave.",
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
