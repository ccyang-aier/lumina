import "./globals.css";
import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SidePanelProvider } from "@/components/layout/SidePanelContext";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { DynamicLayoutParts } from "@/components/layout/DynamicLayoutParts";
import { CodeThemeProvider } from "@/lib/CodeThemeContext";
import NextTopLoader from "nextjs-toploader";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Lumina - Knowledge Platform",
  description: "Share Knowledge, Empower Growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${orbitron.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CodeThemeProvider>
          <SidePanelProvider>
            {/*
              LayoutShell is a client component that applies a right-padding
              transition to push the entire page (Navbar + content + Footer)
              left when the panel opens, without any overlay or pointer-events mask.
            */}
            <LayoutShell>
              <NextTopLoader showSpinner={false} color="#00C2FF" height={3} />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </LayoutShell>

            {/* Panel renders fixed/full-height outside the layout flow */}
            <DynamicLayoutParts />
          </SidePanelProvider>
          </CodeThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
