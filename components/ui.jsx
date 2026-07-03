"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

/** HUD-style panel: dark glass with thin lime border and corner brackets. */
export function HudPanel({ children, className = "" }) {
  return (
    <div
      className={`relative rounded-xl border border-lime-300/[0.14] bg-[#050b12]/85 shadow-[0_0_60px_rgba(120,255,150,0.05),0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl ${className}`}
    >
      <CornerBrackets />
      {children}
    </div>
  );
}

export function CornerBrackets() {
  const base = "pointer-events-none absolute h-3.5 w-3.5 border-lime-300/50";
  return (
    <>
      <span aria-hidden className={`${base} left-[-1px] top-[-1px] rounded-tl border-l border-t`} />
      <span aria-hidden className={`${base} right-[-1px] top-[-1px] rounded-tr border-r border-t`} />
      <span aria-hidden className={`${base} bottom-[-1px] left-[-1px] rounded-bl border-b border-l`} />
      <span aria-hidden className={`${base} bottom-[-1px] right-[-1px] rounded-br border-b border-r`} />
    </>
  );
}

/** Primary action button — launch-console style. */
export function LaunchButton({ children, onClick, disabled, loading }) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.015 }}
      whileTap={disabled ? {} : { scale: 0.975 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative w-full overflow-hidden rounded-lg px-4 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
        disabled
          ? "cursor-not-allowed border border-white/10 bg-white/[0.04] text-white/30"
          : "border border-lime-300/50 bg-gradient-to-r from-lime-400/20 via-emerald-400/25 to-teal-400/20 text-lime-200 shadow-[0_0_24px_rgba(163,230,53,0.15)] hover:border-lime-300/80 hover:shadow-[0_0_36px_rgba(163,230,53,0.3)]"
      }`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && <Loader2 size={15} className="animate-spin" />}
        {children}
      </span>
      {!disabled && (
        <span aria-hidden className="absolute inset-0 -translate-x-full animate-[sheen_3.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-lime-200/15 to-transparent" />
      )}
    </motion.button>
  );
}

/** Label / value row for quote details. */
export function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="font-mono uppercase tracking-wider text-white/35">{label}</span>
      <span className="text-right font-medium text-white/80">{children}</span>
    </div>
  );
}

/** Small section label, HUD style. */
export function HudLabel({ children }) {
  return (
    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-lime-300/60">
      {children}
    </span>
  );
}

/** Token / chain logo with graceful fallback. */
export function Logo({ src, alt, size = 24, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        style={{ width: size, height: size, fontSize: size * 0.45 }}
        className={`flex items-center justify-center rounded-full bg-lime-400/15 font-mono font-bold text-lime-300 ${className}`}
      >
        {alt?.[0] ?? "?"}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`rounded-full ${className}`}
      draggable="false"
    />
  );
}
