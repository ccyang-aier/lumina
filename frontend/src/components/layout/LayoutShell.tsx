"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useSidePanel } from "./SidePanelContext";

/**
 * LayoutShell is the outer page wrapper that shifts the entire layout
 * (Navbar + content + Footer) to the left when the side panel is open,
 * creating a true push-aside layout without any overlay masking.
 *
 * It is a client component so it can read panel state from context, but
 * it receives server-rendered children as opaque React nodes — this is a
 * valid Next.js App Router pattern.
 */
export function LayoutShell({ children }: { children: ReactNode }) {
  const { isOpen, panelWidth, isResizing } = useSidePanel();
  const [isDesktop, setIsDesktop] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Always push content by panelWidth when open on desktop.
  // (The "fullscreen" button now just widens the panel to 576px — still a
  //  push-aside layout, not a true overlay.)
  const paddingRight = mounted && isOpen && isDesktop ? panelWidth : 0;

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{
        paddingRight,
        // Disable transition during live resize to keep layout in sync with drag.
        transition: isResizing
          ? "none"
          : "padding-right 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
}
