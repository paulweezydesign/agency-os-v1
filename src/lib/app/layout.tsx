import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgencyOS v1",
  description: "AI-native agency operating system built with Mastra, MongoDB, and Composio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="shell">{children}</main>
      </body>
    </html>
  );
}
