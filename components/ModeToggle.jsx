"use client";

import { motion } from "framer-motion";
import { Sparkles, FlaskConical } from "lucide-react";
import { useMode } from "../context/ModeContext";

const OPTIONS = [
  { value: "demo", label: "Demo", icon: Sparkles },
  { value: "testnet", label: "Testnet", icon: FlaskConical },
];

/** Segmented Demo / Testnet switch with a sliding indicator. */
export default function ModeToggle() {
  const { mode, setMode } = useMode();

  return (
    <div
      role="tablist"
      aria-label="App mode"
      className="relative flex rounded-full border border-lime-300/25 bg-[#060c14]/80 p-1 backdrop-blur-md"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            role="tab"
            aria-selected={active}
            onClick={() => setMode(value)}
            className={`relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
              active ? "text-[#04120a]" : "text-white/50 hover:text-white/85"
            }`}
          >
            {active && (
              <motion.span
                layoutId="gb-mode-pill"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-lime-300 to-emerald-300 shadow-[0_0_18px_rgba(163,230,53,0.4)]"
              />
            )}
            <Icon size={12} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
