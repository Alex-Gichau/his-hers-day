import type { Metadata } from "next";
import { Caveat, Montserrat, Praise } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const gotham = Montserrat({
  variable: "--font-gotham-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// "Praise" is the wedding script used for all display typography.
const script = Praise({
  variable: "--font-wedding-script",
  subsets: ["latin"],
  weight: "400",
});

// "Caveat" is a handwriting face used for the letter section.
const handwriting = Caveat({
  variable: "--font-handwriting-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hers & His | Wedding Celebration",
  description: "A modern wedding invitation experience for Hers and His.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      {/* No `bg-background` here on purpose: globals.css keeps the base colour on
          <html> and the body transparent, so the fixed `body::after` damask
          layer (z-index: -1) is not painted over by the body background. */}
      <body
        className={`${gotham.variable} ${script.variable} ${handwriting.variable} min-h-screen antialiased`}
      >
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
