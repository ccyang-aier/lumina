"use client";

import { type ReactNode } from "react";

/**
 * LayoutShell is the outer page wrapper for the main content area.
 * The AI side panel now uses floating overlay mode, so the main content
 * no longer needs to shift or adjust when the panel is open.
 *
 * It receives server-rendered children as opaque React nodes — this is a
 * valid Next.js App Router pattern.
 */
export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {children}
    </div>
  );
}
