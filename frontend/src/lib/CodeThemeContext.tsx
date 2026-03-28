"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "lumina-code-theme";

interface CodeThemeCtx {
  globalThemeId: string | null;
  setGlobalThemeId: (id: string | null) => void;
}

const CodeThemeContext = createContext<CodeThemeCtx>({
  globalThemeId: null,
  setGlobalThemeId: () => {},
});

export function CodeThemeProvider({ children }: { children: ReactNode }) {
  const [globalThemeId, setGlobalThemeId] = useState<string | null>(null);

  // Restore saved theme from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setGlobalThemeId(saved);
    } catch {
      // localStorage not available
    }
  }, []);

  const handleSet = (id: string | null) => {
    setGlobalThemeId(id);
    try {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage not available
    }
  };

  return (
    <CodeThemeContext.Provider value={{ globalThemeId, setGlobalThemeId: handleSet }}>
      {children}
    </CodeThemeContext.Provider>
  );
}

export const useCodeTheme = () => useContext(CodeThemeContext);
