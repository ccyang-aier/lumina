"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

export const DEFAULT_PANEL_WIDTH = 486;
export const MIN_PANEL_WIDTH = 280;
export const MAX_PANEL_WIDTH = 800;

export interface CodeReference {
  id: string;
  content: string;
  language?: string;
  preview?: string;
}

interface SidePanelContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  panelWidth: number;
  setPanelWidth: (w: number) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isResizing: boolean;
  setIsResizing: (v: boolean) => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  activeCodeRef: CodeReference | null;
  setActiveCodeRef: (ref: CodeReference | null) => void;
}

const SidePanelContext = createContext<SidePanelContextType | null>(null);

export function SidePanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelWidth, setPanelWidthRaw] = useState(DEFAULT_PANEL_WIDTH);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeCodeRef, setActiveCodeRef] = useState<CodeReference | null>(null);

  const panelWidthRef = useRef(DEFAULT_PANEL_WIDTH);
  // Sync ref for isOpen so toggle() can read current value without stale closure
  const isOpenRef = useRef(false);

  const setPanelWidth = useCallback((w: number) => {
    const clamped = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, w));
    panelWidthRef.current = clamped;
    setPanelWidthRaw(clamped);
  }, []);

  /** Reset width + fullscreen state — called on open and close */
  const resetToDefault = useCallback(() => {
    panelWidthRef.current = DEFAULT_PANEL_WIDTH;
    setPanelWidthRaw(DEFAULT_PANEL_WIDTH);
    setIsFullscreen(false);
  }, []);

  const open = useCallback(() => {
    resetToDefault();
    isOpenRef.current = true;
    setIsOpen(true);
  }, [resetToDefault]);

  const close = useCallback(() => {
    resetToDefault();
    isOpenRef.current = false;
    setIsOpen(false);
  }, [resetToDefault]);

  const toggle = useCallback(() => {
    const willOpen = !isOpenRef.current;
    if (willOpen) resetToDefault();
    isOpenRef.current = willOpen;
    setIsOpen(willOpen);
  }, [resetToDefault]);

  /**
   * Toggles between DEFAULT width and MAX width.
   * Close (or reopen) always resets back to default — handled by open/close.
   */
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((was) => {
      if (!was) {
        panelWidthRef.current = MAX_PANEL_WIDTH;
        setPanelWidthRaw(MAX_PANEL_WIDTH);
        return true;
      } else {
        panelWidthRef.current = DEFAULT_PANEL_WIDTH;
        setPanelWidthRaw(DEFAULT_PANEL_WIDTH);
        return false;
      }
    });
  }, []);

  return (
    <SidePanelContext.Provider
      value={{
        isOpen,
        toggle,
        open,
        close,
        panelWidth,
        setPanelWidth,
        isFullscreen,
        toggleFullscreen,
        isResizing,
        setIsResizing,
        inputValue,
        setInputValue,
        activeCodeRef,
        setActiveCodeRef,
      }}
    >
      {children}
    </SidePanelContext.Provider>
  );
}

export function useSidePanel() {
  const ctx = useContext(SidePanelContext);
  if (!ctx)
    throw new Error("useSidePanel must be used within SidePanelProvider");
  return ctx;
}
