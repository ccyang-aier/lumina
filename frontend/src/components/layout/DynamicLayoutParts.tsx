"use client";

import dynamic from "next/dynamic";

const SidePanelContent = dynamic(
  () => import("@/components/layout/SidePanelContent").then((mod) => mod.SidePanelContent),
  { ssr: false }
);

const SidePanelTrigger = dynamic(
  () => import("@/components/layout/SidePanelTrigger").then((mod) => mod.SidePanelTrigger),
  { ssr: false }
);

export function DynamicLayoutParts() {
  return (
    <>
      <SidePanelContent />
      <SidePanelTrigger />
    </>
  );
}
