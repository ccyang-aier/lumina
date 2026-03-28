"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Download, Flag, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageActionsProps {
  markdownContent: string;
  title: string;
}

export function PageActions({ markdownContent, title }: PageActionsProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: textarea trick
      const el = document.createElement("textarea");
      el.value = markdownContent;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setOpen(false);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[/\\?%*:|"<>]/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const handleFeedback = () => {
    const subject = encodeURIComponent(`[内容错误反馈] ${title}`);
    const body = encodeURIComponent(`我在阅读《${title}》时发现以下内容存在错误：\n\n（请在此描述问题）\n\n页面链接：${typeof window !== "undefined" ? window.location.href : ""}`);
    window.open(`mailto:feedback@lumina.ai?subject=${subject}&body=${body}`, "_blank");
    setOpen(false);
  };

  const dropdownActions = [
    {
      icon: Copy,
      label: "复制为 Markdown",
      desc: "将页面内容复制到剪贴板",
      onClick: handleCopyMarkdown,
    },
    {
      icon: Download,
      label: "下载源文件",
      desc: "下载原始 .md 格式文件",
      onClick: handleDownload,
    },
    {
      icon: Flag,
      label: "内容错误反馈",
      desc: "报告页面中的错误或问题",
      onClick: handleFeedback,
      danger: true,
    },
  ];

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      {/* Split button */}
      <div className={cn(
        "flex items-center rounded-lg border bg-background shadow-sm overflow-hidden transition-shadow",
        open ? "border-border/80 shadow-md" : "border-border/60 hover:shadow-md"
      )}>
        {/* Primary action: copy markdown */}
        <button
          onClick={handleCopyMarkdown}
          className="flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
        >
          {copied
            ? <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            : <Copy className="w-3.5 h-3.5 flex-shrink-0" />
          }
          <span>{copied ? "已复制" : "复制页面"}</span>
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-border/60" />

        {/* Dropdown toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          aria-label="更多操作"
        >
          <ChevronDown
            className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")}
          />
        </button>
      </div>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-background shadow-xl overflow-hidden z-50"
          >
            {dropdownActions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors group",
                  action.danger
                    ? "hover:bg-red-50 dark:hover:bg-red-950/30"
                    : "hover:bg-muted/70"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-colors",
                  action.danger
                    ? "border-red-200 dark:border-red-800/50 text-red-400 group-hover:text-red-500 group-hover:border-red-300 dark:group-hover:border-red-700"
                    : "border-border text-muted-foreground group-hover:text-foreground group-hover:border-border/80"
                )}>
                  <action.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className={cn(
                    "text-sm font-medium",
                    action.danger ? "text-red-600 dark:text-red-400" : "text-foreground"
                  )}>
                    {action.label}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{action.desc}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
