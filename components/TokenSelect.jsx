"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { formatAmount, formatUsd } from "../lib/format";
import { usdPrice } from "../hooks/usePrices";
import { Logo, CornerBrackets } from "./ui";

/** Full-screen token picker modal (demo mode). */
export default function TokenSelect({ open, onClose, onSelect, selected, tokens, balances, prices }) {
  const [query, setQuery] = useState("");
  // portal target only exists client-side
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens;
    return tokens.filter(
      (t) => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
    );
  }, [tokens, query]);

  if (!mounted) return null;

  // Portalled to <body>: the console panel's backdrop-blur creates a CSS
  // containing block, which would trap this fixed overlay inside the card.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#02030a]/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[min(94vw,26rem)] rounded-xl border border-lime-300/20 bg-[#050b12]/95 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.8)]"
            role="dialog"
            aria-label="Select token"
          >
            <CornerBrackets />
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-lime-300/80">
                Select cargo
              </h3>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 focus-within:border-lime-300/40">
              <Search size={14} className="shrink-0 text-white/35" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search token…"
                className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
              />
            </div>

            <div className="max-h-[46vh] space-y-0.5 overflow-y-auto pr-1">
              {filtered.map((token) => {
                const balance = balances?.[token.symbol] ?? 0;
                const price = usdPrice(prices, token.coingeckoId);
                const active = token.symbol === selected?.symbol;
                return (
                  <button
                    key={token.symbol}
                    onClick={() => onSelect(token)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors ${
                      active ? "bg-lime-400/10" : "hover:bg-white/[0.06]"
                    }`}
                  >
                    <Logo src={token.img} alt={token.symbol} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-white">{token.symbol}</span>
                      <span className="block truncate text-xs text-white/40">{token.name}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-sm tabular-nums text-white/85">
                        {formatAmount(balance)}
                      </span>
                      {price !== null && balance > 0 && (
                        <span className="block text-[10px] tabular-nums text-white/35">
                          {formatUsd(balance * price)}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="py-8 text-center font-mono text-xs text-white/35">
                  No signals found for “{query}”
                </p>
              )}
            </div>

            <p className="mt-3 border-t border-white/[0.06] pt-3 text-center font-mono text-[9px] uppercase tracking-wider text-white/25">
              Demo cargo hold · balances shown for origin network
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
