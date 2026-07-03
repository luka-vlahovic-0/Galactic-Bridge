"use client";

import { motion } from "framer-motion";
import ModeToggle from "./ModeToggle";
import ConnectButton from "./ConnectButton";

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-20 flex items-center justify-between gap-3 px-4 py-4 sm:px-8"
    >
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/alienLogo.png"
          alt="Galactic Bridge"
          className="h-9 w-9 rounded-full border border-lime-300/30 object-cover shadow-[0_0_16px_rgba(163,230,53,0.25)]"
          draggable="false"
        />
        <div className="hidden sm:block">
          <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-white">
            Galactic<span className="text-lime-300">Bridge</span>
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
            Interchain transit authority
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />
        <ConnectButton />
      </div>
    </motion.header>
  );
}
