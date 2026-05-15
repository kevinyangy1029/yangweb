import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YangWeb",
  description: "Personal hub & tool portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-[var(--card-border)] px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              YangWeb
            </Link>
            <nav className="flex gap-6 text-sm text-[var(--muted)]">
              <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
              <Link href="/admin" className="hover:text-[var(--foreground)] transition-colors">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--card-border)] px-6 py-4 text-center text-xs text-[var(--muted)]">
          &copy; {new Date().getFullYear()} YangWeb
        </footer>
      </body>
    </html>
  );
}
