"use client";

import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { starterLedger } from "../lib/demo";

const ModeContext = createContext(null);
const MODE_KEY = "gb-mode-v1";
const LEDGER_KEY = "gb-demo-ledger-v1";

const loadLedger = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(LEDGER_KEY));
    if (!saved) return starterLedger;
    // merge so new chains/tokens added later still appear
    const merged = {};
    for (const [chainKey, tokens] of Object.entries(starterLedger)) {
      merged[chainKey] = { ...tokens, ...(saved[chainKey] ?? {}) };
    }
    return merged;
  } catch {
    return starterLedger;
  }
};

export function ModeProvider({ children }) {
  // start deterministic for SSR, then hydrate persisted state
  const [mode, setMode] = useState("demo");
  const [ledger, setLedger] = useState(starterLedger);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem(MODE_KEY);
    if (savedMode === "demo" || savedMode === "testnet") setMode(savedMode);
    setLedger(loadLedger());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(MODE_KEY, mode);
  }, [mode, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
  }, [ledger, hydrated]);

  /** Move `amount` of `symbol` from one chain to another, minus `fee`. */
  const moveDemoFunds = useCallback(({ fromKey, toKey, symbol, amount, received }) => {
    setLedger((prev) => {
      const next = structuredClone(prev);
      next[fromKey][symbol] = Math.max(0, (next[fromKey][symbol] ?? 0) - amount);
      next[toKey][symbol] = (next[toKey][symbol] ?? 0) + received;
      return next;
    });
  }, []);

  const resetLedger = useCallback(() => setLedger(structuredClone(starterLedger)), []);

  const value = useMemo(
    () => ({ mode, setMode, ledger, moveDemoFunds, resetLedger }),
    [mode, ledger, moveDemoFunds, resetLedger]
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export const useMode = () => useContext(ModeContext);
