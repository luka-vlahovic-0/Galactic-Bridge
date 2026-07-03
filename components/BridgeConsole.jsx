"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useMode } from "../context/ModeContext";
import { useToast } from "../context/ToastContext";
import { usePrices } from "../hooks/usePrices";
import { HudPanel } from "./ui";
import DemoBridge from "./DemoBridge";
import TestnetBridge from "./TestnetBridge";

export default function BridgeConsole() {
  const { mode, resetLedger } = useMode();
  const toast = useToast();
  const prices = usePrices();
  const demo = mode === "demo";

  return (
    <HudPanel className="w-[min(94vw,27.5rem)] p-5 sm:p-6">
      {/* console header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-lg font-bold uppercase tracking-[0.2em] text-white">
            Transit console
          </h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/35">
            {demo ? "Simulation deck · local cargo, live prices" : "Live testnet · real transactions, worthless tokens"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {demo && (
            <button
              onClick={() => {
                resetLedger();
                toast.info("Simulation reset", "Demo cargo holds restocked to starting levels.");
              }}
              className="rounded-md border border-white/10 p-1.5 text-white/40 transition-colors hover:border-lime-300/40 hover:text-lime-300"
              aria-label="Reset demo balances"
              title="Reset demo balances"
            >
              <RotateCcw size={13} />
            </button>
          )}
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest ${
              demo
                ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-300"
                : "border-lime-300/40 bg-lime-400/10 text-lime-300"
            }`}
          >
            <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${demo ? "bg-cyan-300" : "bg-lime-300"}`} />
            {demo ? "Demo" : "Testnet"}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: demo ? -18 : 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: demo ? 18 : -18 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {demo ? <DemoBridge prices={prices} /> : <TestnetBridge prices={prices} />}
        </motion.div>
      </AnimatePresence>
    </HudPanel>
  );
}
