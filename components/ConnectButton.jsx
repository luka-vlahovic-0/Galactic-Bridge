"use client";

import { motion } from "framer-motion";
import { Wallet, AlertTriangle } from "lucide-react";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

/** Wallet chip, HUD-styled, backed by RainbowKit's modals. */
export default function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        // reserve layout before hydration so the navbar doesn't jump
        if (!ready) {
          return <div aria-hidden className="h-9 w-28 rounded-full border border-white/10 opacity-0" />;
        }

        if (!connected) {
          return (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openConnectModal}
              className="flex items-center gap-2 rounded-full border border-lime-300/50 bg-lime-400/10 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-lime-200 transition-shadow hover:shadow-[0_0_20px_rgba(163,230,53,0.25)]"
            >
              <Wallet size={13} />
              Connect
            </motion.button>
          );
        }

        if (chain.unsupported) {
          return (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openChainModal}
              className="flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-400/10 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-amber-300"
            >
              <AlertTriangle size={13} />
              Wrong sector
            </motion.button>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openChainModal}
              className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-2 font-mono text-[11px] text-white/70 backdrop-blur-md transition-colors hover:border-lime-300/40 hover:text-white sm:flex"
              title="Switch network"
            >
              {chain.hasIcon && chain.iconUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={chain.iconUrl} alt={chain.name ?? "chain"} className="h-4 w-4 rounded-full" />
              )}
              {chain.name}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openAccountModal}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-2 font-mono text-xs text-white/85 backdrop-blur-md transition-colors hover:border-lime-300/40"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
              {account.displayName}
            </motion.button>
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
