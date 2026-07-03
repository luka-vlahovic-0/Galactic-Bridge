"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, X, ExternalLink } from "lucide-react";
import { Logo } from "./ui";

const PHASES = ["wallet", "origin", "transit", "arrived"];

function useElapsed(startedAt, running) {
  const [, force] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

// Where the ship sits on the route line for each phase (as % of width)
const SHIP_POSITION = { wallet: "4%", origin: "18%", transit: "58%", arrived: "92%" };

/**
 * Mission-log style progress readout for a transfer.
 * transfer: { fromChain, toChain, amountLabel, phase, txHash?, explorer?,
 *             startedAt, receivedLabel?, error?, demo? }
 */
export default function TransferTracker({ transfer, onDismiss }) {
  const { fromChain, toChain, amountLabel, phase, txHash, explorer, startedAt, receivedLabel, error, demo } = transfer;
  const phaseIndex = PHASES.indexOf(phase);
  const finished = phase === "arrived" || !!error;
  const elapsed = useElapsed(startedAt, !finished);

  const logs = [
    { id: "wallet", text: "uplink established — awaiting wallet signature" },
    {
      id: "origin",
      text: `ignition confirmed on ${fromChain.name}`,
      link: txHash && explorer ? `${explorer}/tx/${txHash}` : null,
    },
    { id: "transit", text: `cargo in transit → ${toChain.name}` },
    { id: "arrived", text: receivedLabel ? `touchdown — ${receivedLabel}` : `touchdown on ${toChain.name}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="overflow-hidden"
    >
      <div className="mt-4 rounded-lg border border-lime-300/20 bg-[#071209]/60 p-4">
        {/* header: route with travelling ship */}
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-lime-300/70">
            Mission log {demo && <span className="text-cyan-300/70">· demo</span>}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tabular-nums text-white/40">T+{elapsed}</span>
            {finished && (
              <button
                onClick={onDismiss}
                className="rounded p-0.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2.5">
          <Logo src={fromChain.img} alt={fromChain.name} size={22} />
          <div className="relative h-6 flex-1">
            <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-lime-300/25" />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              animate={{ left: SHIP_POSITION[error ? "origin" : phase] ?? "4%" }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
            >
              <motion.div
                animate={finished || error ? {} : { y: [0, -2.5, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              >
                <Rocket
                  size={15}
                  className={`rotate-45 ${error ? "text-rose-400" : phase === "arrived" ? "text-lime-300" : "text-lime-200"}`}
                />
              </motion.div>
            </motion.div>
          </div>
          <Logo src={toChain.img} alt={toChain.name} size={22} />
          <span className="ml-1 whitespace-nowrap font-mono text-xs font-semibold text-white/90">
            {amountLabel}
          </span>
        </div>

        {/* terminal log */}
        <div className="space-y-1.5 border-t border-white/[0.06] pt-3 font-mono text-[11px] leading-relaxed">
          {logs.map((log, i) => {
            const state = i < phaseIndex ? "done" : i === phaseIndex ? "active" : "pending";
            if (state === "pending") return null;
            const failedHere = error && state === "active";
            return (
              <motion.p
                key={log.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-1.5 ${
                  failedHere
                    ? "text-rose-300"
                    : state === "done" || phase === "arrived"
                      ? "text-lime-200/70"
                      : "text-lime-100"
                }`}
              >
                <span className="text-lime-300/50">›</span>
                <span className="min-w-0 flex-1 truncate">{log.text}</span>
                {log.link && (
                  <a
                    href={log.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-white/35 transition-colors hover:text-lime-300"
                    aria-label="View transaction on explorer"
                  >
                    <ExternalLink size={11} />
                  </a>
                )}
                {state === "active" && !failedHere && phase !== "arrived" && (
                  <span className="gb-cursor h-3 w-1.5 shrink-0 bg-lime-300/80" />
                )}
              </motion.p>
            );
          })}
          {error && <p className="pt-1 text-[11px] leading-relaxed text-rose-300/90">{error}</p>}
          {phase === "arrived" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-1 font-bold text-lime-300"
            >
              › mission complete in T+{elapsed} ✦
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
