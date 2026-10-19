import type { Metadata } from "next";
import { Great_Vibes, Montserrat, Parisienne } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const gotham = Montserrat({
  variable: "--font-gotham-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const script = Great_Vibes({
  variable: "--font-wedding-script",
  subsets: ["latin"],
  weight: "400",
});

const scriptAlt = Parisienne({
  variable: "--font-wedding-script-alt",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Gloria & Peter | Wedding Celebration",
  description: "A modern wedding invitation experience for Gloria and Peter.",
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
      <body
        className={`${gotham.variable} ${script.variable} ${scriptAlt.variable} min-h-screen bg-background antialiased`}
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
