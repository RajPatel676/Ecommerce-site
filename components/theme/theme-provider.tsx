"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Mode = "light" | "dark" | "system";
export type Accent = "terracotta" | "indigo" | "morpankh" | "banni" | "vann";

export const ACCENTS: {
  key: Accent;
  name: string;
  gujarati: string;
  /** [ground, surface, accent] for each mode — the picker previews the whole
      theme, because an accent changes far more than the buttons. */
  preview: {
    light: [string, string, string];
    dark: [string, string, string];
  };
}[] = [
  {
    key: "terracotta",
    name: "Terracotta",
    gujarati: "કચ્છી લાલ",
    preview: {
      light: ["#FAF5EC", "#E5D5BD", "#B4432B"],
      dark: ["#17120F", "#382C24", "#E0714F"],
    },
  },
  {
    key: "indigo",
    name: "Indigo",
    gujarati: "ગળી",
    preview: {
      light: ["#EFF3F7", "#C3D0DF", "#2E4159"],
      dark: ["#0F1317", "#242D38", "#7CA0C4"],
    },
  },
  {
    key: "morpankh",
    name: "Morpankh",
    gujarati: "મોરપંખ",
    preview: {
      light: ["#F0FBF5", "#C5E8D8", "#256B62"],
      dark: ["#101815", "#253A32", "#5FBCAC"],
    },
  },
  {
    key: "banni",
    name: "Banni",
    gujarati: "બન્ની",
    preview: {
      light: ["#FDEEF1", "#EEBFCD", "#6B3F5B"],
      dark: ["#1A0E13", "#3F212D", "#C78BB2"],
    },
  },
  {
    key: "vann",
    name: "Vann",
    gujarati: "વન",
    preview: {
      light: ["#F0FAF1", "#C7E7CC", "#3F6355"],
      dark: ["#101811", "#263A2A", "#7DB79C"],
    },
  },
];

export const THEME_KEY = "vg.theme.v1";

/**
 * Runs before first paint (injected into <head>) so the page never flashes
 * the light theme on its way to dark. Kept deliberately tiny and dependency
 * free — it is inlined as a string.
 */
export const noFlashScript = `
(function(){
  try {
    var s = localStorage.getItem("${THEME_KEY}");
    var t = s ? JSON.parse(s) : {};
    var mode = t.mode || "system";
    var accent = t.accent || "terracotta";
    var dark = mode === "dark" || (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
    var r = document.documentElement;
    r.classList.toggle("dark", dark);
    r.setAttribute("data-accent", accent);
    r.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();
`;

interface ThemeValue {
  mode: Mode;
  accent: Accent;
  /** What the mode actually resolves to right now. */
  resolved: "light" | "dark";
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
  ready: boolean;
}

const ThemeContext = createContext<ThemeValue | null>(null);

function systemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("system");
  const [accent, setAccentState] = useState<Accent>("terracotta");
  const [systemDark, setSystemDark] = useState(false);
  const [ready, setReady] = useState(false);

  // pick up whatever the no-flash script already applied
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(THEME_KEY);
      const t = raw ? JSON.parse(raw) : {};
      if (t.mode) setModeState(t.mode);
      if (t.accent) setAccentState(t.accent);
    } catch {
      /* private mode — fall back to the defaults */
    }
    setSystemDark(systemPrefersDark());
    setReady(true);
  }, []);

  // follow the OS while the mode is "system"
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolved: "light" | "dark" =
    mode === "system" ? (systemDark ? "dark" : "light") : mode;

  // apply to <html> and persist
  useEffect(() => {
    if (!ready) return;
    const r = document.documentElement;
    r.classList.toggle("dark", resolved === "dark");
    r.setAttribute("data-accent", accent);
    r.style.colorScheme = resolved;
    try {
      window.localStorage.setItem(THEME_KEY, JSON.stringify({ mode, accent }));
    } catch {
      /* ignore */
    }
  }, [mode, accent, resolved, ready]);

  const setMode = useCallback((m: Mode) => setModeState(m), []);
  const setAccent = useCallback((a: Accent) => setAccentState(a), []);

  return (
    <ThemeContext.Provider
      value={{ mode, accent, resolved, setMode, setAccent, ready }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
