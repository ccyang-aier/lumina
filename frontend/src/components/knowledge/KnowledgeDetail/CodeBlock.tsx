"use client";

import { useState, type ReactNode } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidePanel } from "@/components/layout/SidePanelContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CodeBlockProps {
  children: ReactNode;
  rawCode: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ children, rawCode, language, className }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { open, setActiveCodeRef } = useSidePanel();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleStar = () => {
    open();
    // Set active code reference instead of input value
    setActiveCodeRef({
      id: Math.random().toString(36).substring(7),
      content: rawCode,
      language,
      preview: rawCode.split('\n')[0].substring(0, 30) + '...'
    });
  };

  return (
    <div className={cn("relative group", className)}>
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <TooltipProvider delayDuration={100}>
          {/* Copy Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm border border-border/50 cursor-pointer"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isCopied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Check className="w-4 h-4 text-emerald-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Copy className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isCopied ? "已复制" : "复制"}</p>
            </TooltipContent>
          </Tooltip>

          {/* AI Sidebar Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleStar}
                className="p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm border border-border/50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>问 AI</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {children}
    </div>
  );
}
