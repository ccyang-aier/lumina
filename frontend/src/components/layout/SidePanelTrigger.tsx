"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { AiAgentBall } from "@/components/design/AiAgentBall";
import { useSidePanel } from "./SidePanelContext";

const BUTTON_SIZE = 80;
const EDGE_MARGIN = 10;

export function SidePanelTrigger() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidePanel();

  // Position stored as CSS bottom/right offsets
  const [pos, setPos] = useState({ bottom: 60, right: 84 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dragOriginRef = useRef({
    mouseX: 0,
    mouseY: 0,
    startBottom: 36,
    startRight: 36,
  });
  const hasDraggedRef = useRef(false);

  // ─── Drag logic ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const clamp = () => {
      setPos((prev) => ({
        bottom: Math.max(EDGE_MARGIN, Math.min(prev.bottom, window.innerHeight - BUTTON_SIZE - EDGE_MARGIN)),
        right: Math.max(EDGE_MARGIN, Math.min(prev.right, window.innerWidth - BUTTON_SIZE - EDGE_MARGIN)),
      }));
    };
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    hasDraggedRef.current = false;
    dragOriginRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startBottom: pos.bottom,
      startRight: pos.right,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragOriginRef.current.mouseX;
      const dy = e.clientY - dragOriginRef.current.mouseY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDraggedRef.current = true;

      setPos({
        right: Math.max(EDGE_MARGIN, Math.min(dragOriginRef.current.startRight - dx, window.innerWidth - BUTTON_SIZE - EDGE_MARGIN)),
        bottom: Math.max(EDGE_MARGIN, Math.min(dragOriginRef.current.startBottom - dy, window.innerHeight - BUTTON_SIZE - EDGE_MARGIN)),
      });
    };

    const onMouseUp = () => setIsDragging(false);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  const handleClick = () => {
    if (!hasDraggedRef.current) toggle();
  };

  // Hide on Alchemy module
  if (pathname?.startsWith("/guild")) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="trigger"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={{ type: "spring", damping: 18, stiffness: 300 }}
          className="fixed z-[60]"
          style={{ bottom: pos.bottom, right: pos.right }}
        >
          {/* Drag wrapper */}
          <div
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              cursor: isDragging ? "grabbing" : "pointer",
              // Remove perspective here as AiAgentBall handles it internally
            }}
          >
             <AiAgentBall size={BUTTON_SIZE} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
