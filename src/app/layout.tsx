import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-cursive",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Happy 19th Birthday, Nia 🎂",
  description: "A special birthday surprise for Aulia Rizky Ramadhaniati — made with love.",
  keywords: ["birthday", "surprise", "ultah", "for Nia", "love letter"],
  authors: [{ name: "Imi" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Happy 19th Birthday, Nia 🎂",
    description: "A special birthday surprise made with love",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy 19th Birthday, Nia 🎂",
    description: "A special birthday surprise made with love",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${dancingScript.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
