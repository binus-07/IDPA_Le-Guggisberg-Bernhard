import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IDPA Marketing-Freelancer-Plattform",
  description: "Marketing-Freelancer-Plattform fuer Unternehmen und Freelancer",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${anton.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <meta name="color-scheme" content="dark" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="relative z-[1] border-t border-border bg-card px-6 py-4 text-center md:px-10">
          <Link
            href="/impressum"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Impressum
          </Link>
        </footer>
      </body>
    </html>
  );
}
