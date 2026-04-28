import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Webhook Inspector",
  description: "Real-time webhook debugging dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}