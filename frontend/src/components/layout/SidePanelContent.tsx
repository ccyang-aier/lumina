"use client";

import {
  useCallback,
  useRef,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Loader2,
  Code,
} from "lucide-react";
import { LuminaIcon } from "@/components/ui/lumina-icon";
import { AiChatInput } from "@/components/design/AiChatInput";
import {
  useSidePanel,
  MIN_PANEL_WIDTH,
  MAX_PANEL_WIDTH,
  CodeReference,
} from "./SidePanelContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
  codeRef?: CodeReference;
}

const INITIAL_MESSAGES: Message[] = [
  { id: "1", role: "user", content: "你好，今天天气怎么样？", time: "10:24" },
  {
    id: "2",
    role: "assistant",
    content:
      "我可以帮你查今天的天气。你想查哪个城市/地区的天气？（例如：北京、上海、深圳）",
    time: "10:24",
  },
  { id: "3", role: "user", content: "给我一个当前天气的穿搭推荐。", time: "10:25" },
  {
    id: "4",
    role: "assistant",
    content:
      "我需要知道你所在的城市或地区才能给出针对今天天气的穿搭建议。你在哪个城市？如果你愿意，也可以直接告诉我现在的天气（温度、是否下雨/风大等）。",
    time: "10:25",
  },
];

const SPRING = { type: "spring", damping: 32, stiffness: 280, mass: 0.9 } as const;

// ─── Shared tooltip (for action buttons only) ─────────────────────────────────

function Tip({ children, label }: { children: ReactNode; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, y: 3, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 3, scale: 0.88 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground/90 px-2 py-0.5 text-[10px] font-medium text-background shadow-md z-50"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function SidePanelContent() {
  return (
    <>
      <DesktopPanel />
      <MobileDrawer />
    </>
  );
}

// ─── Desktop ──────────────────────────────────────────────────────────────────

function DesktopPanel() {
  const { isOpen, close, panelWidth, setPanelWidth, isFullscreen, toggleFullscreen, setIsResizing } =
    useSidePanel();

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = panelWidth;
      setIsResizing(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMouseMove = (ev: MouseEvent) => {
        const dx = startX - ev.clientX;
        setPanelWidth(Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, startWidth + dx)));
      };
      const onMouseUp = () => {
        setIsResizing(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [panelWidth, setPanelWidth, setIsResizing]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="desktop-panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={SPRING}
          className="fixed right-0 top-0 z-40 hidden h-screen flex-col md:flex"
          style={{ width: panelWidth }}
        >
          <div
            onMouseDown={handleResizeStart}
            className="group absolute inset-y-0 left-0 z-10 w-3 cursor-col-resize"
          >
            <div className="absolute inset-y-0 left-1 w-px bg-border/50 transition-all duration-150 group-hover:left-0.5 group-hover:w-[3px] group-hover:bg-primary/60" />
          </div>
          <PanelInner
            onClose={close}
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Mobile drawer ────────────────────────────────────────────────────────────

function MobileDrawer() {
  const { isOpen, close } = useSidePanel();
  return (
    <div className="md:hidden">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={SPRING}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[486px] flex-col shadow-2xl"
            >
              <PanelInner onClose={close} onToggleFullscreen={() => {}} isFullscreen={false} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Shared panel shell ───────────────────────────────────────────────────────

function PanelInner({
  onClose,
  onToggleFullscreen,
  isFullscreen,
}: {
  onClose: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}) {
  const { inputValue, setInputValue, activeCodeRef, setActiveCodeRef } = useSidePanel();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const handleSend = (text: string, attachments?: File[], codeRef?: CodeReference) => {
    // Clear input value in context when sent
    setInputValue("");
    setActiveCodeRef(null);

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
      
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: text, time, codeRef },
    ]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: "好的，我正在处理你的请求，请稍候……", time },
      ]);
    }, 800);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-y-0 left-[3px] w-px bg-gradient-to-b from-transparent via-primary/25 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.018] dark:opacity-[0.032]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <PanelHeader onClose={onClose} onToggleFullscreen={onToggleFullscreen} isFullscreen={isFullscreen} />
      <ChatMessages messages={messages} />
      <div className="shrink-0 border-t border-border/50 bg-background/80 px-4 py-3 backdrop-blur-sm">
        <AiChatInput 
          onSend={handleSend} 
          value={inputValue}
          onChange={setInputValue}
          codeRef={activeCodeRef}
          onClearCodeRef={() => setActiveCodeRef(null)}
        />
      </div>
    </div>
  );
}

// ─── Header — no tooltips on these buttons ────────────────────────────────────

function PanelHeader({
  onClose,
  onToggleFullscreen,
  isFullscreen,
}: {
  onClose: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}) {
  return (
    <div className="relative flex h-11 shrink-0 items-center justify-between border-b border-border/60 px-3">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="flex items-center gap-2 pl-1">
        <LuminaIcon className="h-[15px] w-[15px] shrink-0 text-foreground" />
        <span className="text-[13px] font-semibold tracking-tight text-foreground">
          Lumina AI助手
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        <HeaderBtn onClick={onToggleFullscreen}>
          {isFullscreen
            ? <Minimize2 className="h-[14px] w-[14px]" />
            : <Maximize2 className="h-[14px] w-[14px]" />
          }
        </HeaderBtn>
        <HeaderBtn onClick={onClose}>
          <X className="h-[14px] w-[14px]" />
        </HeaderBtn>
      </div>
    </div>
  );
}

function HeaderBtn({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.85 }}
      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground/70 transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none"
    >
      {children}
    </motion.button>
  );
}

// ─── Chat messages ────────────────────────────────────────────────────────────

function ChatMessages({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  let lastAssistantId = "";
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") { lastAssistantId = messages[i].id; break; }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
      <div className="flex flex-col gap-5">
        {messages.map((msg) =>
          msg.role === "user"
            ? <UserBubble key={msg.id} message={msg} />
            : <AssistantBubble key={msg.id} message={msg} isLastAssistant={msg.id === lastAssistantId} />
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

// ─── User bubble ──────────────────────────────────────────────────────────────

function UserBubble({ message }: { message: Message }) {
  return (
    <div className="flex flex-col items-end gap-1">
      {/* Code Reference Pill (In Chat History) */}
      {message.codeRef && (
        <div className="flex items-center gap-2 max-w-[80%] w-fit bg-muted/40 border border-border/40 rounded-full pl-3 pr-4 py-1.5 text-xs text-muted-foreground mb-1 mr-1">
          <Code className="w-3.5 h-3.5 shrink-0 text-primary/70" />
          <span className="truncate font-mono">
            {message.codeRef.preview || "Code Snippet"}
          </span>
        </div>
      )}

      <div className="flex justify-end w-full">
        <div className="group relative max-w-[80%]">
          <div className="rounded-2xl rounded-tr-sm bg-secondary px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground shadow-sm dark:bg-muted">
            {message.content}
          </div>
          <span className="mt-1 block text-right text-[10px] text-muted-foreground/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            {message.time}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Assistant bubble ─────────────────────────────────────────────────────────

function AssistantBubble({ message, isLastAssistant }: { message: Message; isLastAssistant: boolean }) {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(message.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    if (regenerating) return;
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 900);
  };

  const handleVote = (dir: "up" | "down") => {
    setVote((v) => (v === dir ? null : dir));
  };

  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/25 to-purple-500/15 ring-1 ring-primary/20">
        <LuminaIcon className="h-3 w-3 text-foreground" />
      </div>

      <div className="group flex-1 min-w-0">
        <p className="mb-1 text-[11px] font-semibold text-muted-foreground">Lumina AI</p>

        <div className="text-[13px] leading-relaxed text-foreground/85">
          {message.content}
        </div>

        {/* Action button bar */}
        <div
          className={`mt-2.5 flex items-center gap-0.5 transition-opacity duration-200 ${
            isLastAssistant ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {/* Copy */}
          <Tip label={copied ? "已复制" : "复制"}>
            <ActionBtn onClick={handleCopy} active={copied} activeColor="text-emerald-500">
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check size={14} strokeWidth={2.2} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Copy size={14} strokeWidth={1.8} />
                  </motion.span>
                )}
              </AnimatePresence>
            </ActionBtn>
          </Tip>

          {/* Regenerate */}
          <Tip label="重新生成">
            <ActionBtn onClick={handleRegenerate} active={regenerating} activeColor="text-sky-500">
              <motion.span
                animate={{ rotate: regenerating ? 360 : 0 }}
                transition={regenerating ? { duration: 0.7, ease: "linear" } : { duration: 0 }}
              >
                {regenerating
                  ? <Loader2 size={14} strokeWidth={1.8} />
                  : <RotateCcw size={14} strokeWidth={1.8} />
                }
              </motion.span>
            </ActionBtn>
          </Tip>

          {/* Thumbs up */}
          <Tip label={vote === "up" ? "取消赞" : "赞"}>
            <ActionBtn
              onClick={() => handleVote("up")}
              active={vote === "up"}
              activeColor="text-emerald-500"
            >
              <motion.span
                animate={vote === "up" ? { scale: [1, 1.45, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <ThumbsUp
                  size={14}
                  strokeWidth={1.8}
                  fill={vote === "up" ? "currentColor" : "none"}
                />
              </motion.span>
            </ActionBtn>
          </Tip>

          {/* Thumbs down */}
          <Tip label={vote === "down" ? "取消踩" : "踩"}>
            <ActionBtn
              onClick={() => handleVote("down")}
              active={vote === "down"}
              activeColor="text-rose-400"
            >
              <motion.span
                animate={vote === "down" ? { scale: [1, 1.45, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <ThumbsDown
                  size={14}
                  strokeWidth={1.8}
                  fill={vote === "down" ? "currentColor" : "none"}
                />
              </motion.span>
            </ActionBtn>
          </Tip>

          {/* Bookmark */}
          <Tip label={bookmarked ? "取消收藏" : "收藏"}>
            <ActionBtn
              onClick={() => setBookmarked((b) => !b)}
              active={bookmarked}
              activeColor="text-amber-400"
            >
              <motion.span
                animate={bookmarked ? { scale: [1, 1.4, 1], rotate: [0, -12, 0] } : {}}
                transition={{ duration: 0.35 }}
              >
                <Bookmark
                  size={14}
                  strokeWidth={1.8}
                  fill={bookmarked ? "currentColor" : "none"}
                />
              </motion.span>
            </ActionBtn>
          </Tip>

          <span className="ml-2 text-[10px] text-muted-foreground/40">
            {message.time}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Action button base ───────────────────────────────────────────────────────

function ActionBtn({
  children,
  onClick,
  active,
  activeColor,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.72 }}
      className={`flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 hover:bg-accent ${
        active
          ? `${activeColor ?? "text-foreground"}`
          : "text-muted-foreground/50 hover:text-foreground/80"
      }`}
    >
      {children}
    </motion.button>
  );
}
