import "./globals.css";
import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SidePanelProvider } from "@/components/layout/SidePanelContext";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { SidePanelContent } from "@/components/layout/SidePanelContent";
import { SidePanelTrigger } from "@/components/layout/SidePanelTrigger";

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
          <SidePanelProvider>
            {/*
              LayoutShell is a client component that applies a right-padding
              transition to push the entire page (Navbar + content + Footer)
              left when the panel opens, without any overlay or pointer-events mask.
            */}
            <LayoutShell>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </LayoutShell>

            {/* Panel renders fixed/full-height outside the layout flow */}
            <SidePanelContent />

            {/* Floating draggable trigger orb */}
            <SidePanelTrigger />
          </SidePanelProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
