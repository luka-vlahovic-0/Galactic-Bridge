"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { Logo, HudLabel } from "./ui";

/** Chain picker with a HUD dropdown. */
export default function ChainSelect({ chains, selected, onSelect, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative min-w-0 flex-1" ref={ref}>
      <div className="mb-1.5 pl-1">
        <HudLabel>{label}</HudLabel>
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 transition-colors ${
          open
            ? "border-lime-300/50 bg-lime-400/[0.06]"
            : "border-white/10 bg-white/[0.03] hover:border-lime-300/30 hover:bg-white/[0.06]"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <Logo src={selected.img} alt={selected.name} size={26} />
          <span className="truncate text-sm font-semibold text-white">{selected.shortName}</span>
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="listbox"
            className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-lime-300/30 bg-gradient-to-b from-[#0d1626] to-[#060b13] p-1.5 shadow-[inset_0_1px_0_rgba(163,230,53,0.12),0_0_0_1px_rgba(0,0,0,0.6),0_24px_70px_rgba(0,0,0,0.9)]"
          >
            {chains.map((chain) => {
              const active = chain.key === selected.key;
              return (
                <li key={chain.key}>
                  <button
                    onClick={() => {
                      onSelect(chain);
                      setOpen(false);
                    }}
                    className={`relative flex w-full items-center gap-2.5 overflow-hidden rounded-lg px-2.5 py-2 text-left transition-colors ${
                      active
                        ? "bg-lime-400/[0.13] shadow-[inset_0_0_0_1px_rgba(163,230,53,0.25)]"
                        : "hover:bg-lime-300/[0.07]"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r bg-gradient-to-b from-lime-300 to-emerald-400 shadow-[0_0_8px_rgba(163,230,53,0.7)]"
                      />
                    )}
                    <Logo src={chain.img} alt={chain.name} size={24} />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-white">{chain.name}</span>
                      {chain.layer && (
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-white/30">
                          {chain.layer}
                        </span>
                      )}
                    </span>
                    {active && <Check size={14} className="text-lime-300" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
