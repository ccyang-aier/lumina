"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { Copy, Check, Sparkles, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidePanel } from "@/components/layout/SidePanelContext";
import { useCodeTheme } from "@/lib/CodeThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Theme catalog ──────────────────────────────────────────────────────────

interface ThemeDef {
  id: string;
  name: string;
  bg: string;
  accent: string;
}

export const CODE_THEMES: ThemeDef[] = [
  { id: "github-dark-dimmed", name: "GitHub Dark",  bg: "#22272e", accent: "#6cb6ff" },
  { id: "tokyo-night",        name: "Tokyo Night",  bg: "#1a1b26", accent: "#7aa2f7" },
  { id: "dracula",            name: "Dracula",      bg: "#282a36", accent: "#bd93f9" },
  { id: "one-dark-pro",       name: "One Dark",     bg: "#282c34", accent: "#61afef" },
  { id: "catppuccin-mocha",   name: "Catppuccin",   bg: "#1e1e2e", accent: "#89b4fa" },
  { id: "nord",               name: "Nord",         bg: "#2e3440", accent: "#88c0d0" },
  { id: "github-light",       name: "GitHub Light", bg: "#f6f8fa", accent: "#0550ae" },
  { id: "solarized-light",    name: "Solarized",    bg: "#fdf6e3", accent: "#268bd2" },
];

// ─── Shiki singleton (lazy-loaded client-side) ──────────────────────────────

let _hl: any = null;
let _hlPromise: Promise<any> | null = null;

async function getHighlighter() {
  if (_hl) return _hl;
  if (_hlPromise) return _hlPromise;
  _hlPromise = import("shiki")
    .then(({ createHighlighter }) =>
      createHighlighter({
        themes: CODE_THEMES.map((t) => t.id),
        langs: [
          "javascript", "typescript", "tsx", "jsx",
          "python", "bash", "shell", "zsh",
          "json", "yaml", "toml",
          "css", "html", "markdown",
          "rust", "go", "java", "c", "cpp",
          "sql", "plaintext",
        ],
      })
    )
    .then((hl) => {
      _hl = hl;
      return hl;
    });
  return _hlPromise;
}

// Transformer: attach data-line-number to each line span so CSS can display it
const lineNumberTransformer = {
  name: "line-numbers",
  line(node: any, line: number) {
    node.properties = node.properties ?? {};
    node.properties["data-line-number"] = String(line);
  },
};

async function renderTheme(rawCode: string, language: string, themeId: string): Promise<string> {
  const hl = await getHighlighter();
  const loadedLangs: string[] = hl.getLoadedLanguages();
  const safeLang = loadedLangs.includes(language) ? language : "plaintext";
  // Trim leading/trailing blank lines that cause phantom whitespace
  const trimmedCode = rawCode.replace(/^\n+/, "").replace(/\n+$/, "");
  return hl.codeToHtml(trimmedCode, {
    lang: safeLang,
    theme: themeId,
    transformers: [lineNumberTransformer],
  });
}

// ─── Component ──────────────────────────────────────────────────────────────

interface CodeBlockProps {
  children: ReactNode;
  rawCode: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ children, rawCode, language = "plaintext", className }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  // renderedThemeId tracks which theme the current HTML was actually rendered with,
  // so the container bg always matches the HTML content (avoids color flicker on switch)
  const [renderedThemeId, setRenderedThemeId] = useState<string | null>(null);
  const [themedHtml, setThemedHtml] = useState<string | null>(null);
  const [isLoadingTheme, setIsLoadingTheme] = useState(false);

  const themePanelRef = useRef<HTMLDivElement>(null);
  const { open, setActiveCodeRef } = useSidePanel();
  const { globalThemeId, setGlobalThemeId } = useCodeTheme();

  // Re-render this block whenever the global theme changes
  useEffect(() => {
    if (!globalThemeId) {
      setThemedHtml(null);
      setRenderedThemeId(null);
      return;
    }
    let cancelled = false;
    setIsLoadingTheme(true);
    renderTheme(rawCode, language, globalThemeId)
      .then((html) => {
        if (!cancelled) {
          setThemedHtml(html);
          // Only update bg color AFTER the new HTML is ready — prevents mismatch flash
          setRenderedThemeId(globalThemeId);
        }
      })
      .catch((err) => console.error("Theme render failed:", err))
      .finally(() => { if (!cancelled) setIsLoadingTheme(false); });
    return () => { cancelled = true; };
  }, [globalThemeId, rawCode, language]);

  // Close theme panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (themePanelRef.current && !themePanelRef.current.contains(e.target as Node)) {
        setShowThemes(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
    setActiveCodeRef({
      id: Math.random().toString(36).substring(7),
      content: rawCode,
      language,
      preview: rawCode.split("\n")[0].substring(0, 30) + "...",
    });
  };

  const handleThemeSelect = (themeId: string) => {
    // Clicking the active theme resets to default
    setGlobalThemeId(themeId === globalThemeId ? null : themeId);
    setShowThemes(false);
  };

  const handleResetTheme = () => {
    setGlobalThemeId(null);
    setShowThemes(false);
  };

  // Use renderedThemeId (not globalThemeId) so container bg always matches the visible HTML
  const renderedThemeDef = CODE_THEMES.find((t) => t.id === renderedThemeId);
  const activeThemeDef = CODE_THEMES.find((t) => t.id === globalThemeId);
  const toolbarAlwaysVisible = showThemes || isLoadingTheme;

  return (
    <div className={cn("relative group", className)}>
      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div
        className={cn(
          "absolute right-4 top-4 z-10 flex items-center gap-2 transition-opacity duration-200",
          toolbarAlwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <TooltipProvider delayDuration={100}>

          {/* ── Theme switcher ── */}
          <div className="relative" ref={themePanelRef}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowThemes((v) => !v)}
                  className="p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm border border-border/50 cursor-pointer"
                >
                  {isLoadingTheme ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    >
                      <Palette className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Palette className="w-4 h-4" />
                  )}
                </button>
              </TooltipTrigger>
              {/* Tooltip above button, picker panel still opens below */}
              <TooltipContent side="top">
                <p>{activeThemeDef ? `主题: ${activeThemeDef.name}` : "切换主题"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Theme picker panel — opens downward (bottom-left of button) */}
            <AnimatePresence>
              {showThemes && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.93, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93, y: -4 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-background/95 backdrop-blur-sm shadow-2xl overflow-hidden z-50 p-1.5"
                >
                  <div className="px-2.5 py-1.5 mb-0.5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      全局代码主题
                    </span>
                  </div>
                  {CODE_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors",
                        globalThemeId === theme.id ? "bg-muted" : "hover:bg-muted/60"
                      )}
                    >
                      {/* Color swatch: bg + accent stripe */}
                      <div
                        className="flex-shrink-0 w-8 h-5 rounded-md overflow-hidden border border-border/40"
                        style={{
                          background: `linear-gradient(to right, ${theme.bg} 60%, ${theme.accent} 60%)`,
                        }}
                      />
                      <span className="flex-1 text-xs font-medium text-left text-foreground">
                        {theme.name}
                      </span>
                      {globalThemeId === theme.id && (
                        <Check className="w-3.5 h-3.5 text-foreground flex-shrink-0" />
                      )}
                    </button>
                  ))}
                  {globalThemeId && (
                    <button
                      onClick={handleResetTheme}
                      className="w-full flex items-center justify-center px-2.5 py-1.5 mt-0.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors border-t border-border/30 pt-2"
                    >
                      恢复默认
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Copy button ── */}
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
            <TooltipContent side="top">
              <p>{isCopied ? "已复制" : "复制"}</p>
            </TooltipContent>
          </Tooltip>

          {/* ── AI Sidebar button ── */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleStar}
                className="p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm border border-border/50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>问 AI</p>
            </TooltipContent>
          </Tooltip>

        </TooltipProvider>
      </div>

      {/* ── Code content ─────────────────────────────────────────────── */}
      {themedHtml ? (
        // Container bg uses renderedThemeId (not globalThemeId) to prevent
        // color mismatch flash between switching old→new theme
        <div
          className="themed-code-block rounded-xl overflow-hidden"
          style={{ backgroundColor: renderedThemeDef?.bg }}
          dangerouslySetInnerHTML={{ __html: themedHtml }}
        />
      ) : (
        children
      )}
    </div>
  );
}
