import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

// Self-hosted (SIL OFL fonts from Fontsource) so builds don't depend on Google Fonts.
const bangers = localFont({ src: "../../fonts/bangers-latin-400-normal.woff2", variable: "--font-bangers" });
const nunito = localFont({
  src: "../../fonts/nunito-latin-wght-normal.woff2",
  weight: "200 1000",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: { default: "Rutopia", template: "%s · Rutopia" },
  description: "Hand-drawn comics from Rutopia.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bangers.variable} ${nunito.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <header className="mx-auto flex max-w-6xl items-center px-4 pt-4 sm:px-6">
          <Link href="/" className="font-display text-3xl tracking-wide hover:text-red-600">
            Rutopia
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
