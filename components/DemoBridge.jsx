"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, ChevronDown, Clock, Orbit } from "lucide-react";
import { demoChains, demoTokens, DEMO_BRIDGE_FEE } from "../lib/demo";
import { formatAmount, formatUsd, isValidAmountInput } from "../lib/format";
import { useMode } from "../context/ModeContext";
import { useToast } from "../context/ToastContext";
import { usdPrice } from "../hooks/usePrices";
import { LaunchButton, InfoRow, HudLabel, Logo } from "./ui";
import ChainSelect from "./ChainSelect";
import TokenSelect from "./TokenSelect";
import TransferTracker from "./TransferTracker";

// simulated timeline (ms per phase) so the tracker feels like a real transfer
const SIM_WALLET_MS = 700;
const SIM_CONFIRM_MS = 1900;
const SIM_TRANSIT_MS = 3600;

export default function DemoBridge({ prices }) {
  const { ledger, moveDemoFunds } = useMode();
  const toast = useToast();

  const [fromChain, setFromChain] = useState(demoChains[0]);
  const [toChain, setToChain] = useState(demoChains[1]);
  const [token, setToken] = useState(demoTokens[0]);
  const [amount, setAmount] = useState("");
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [transfer, setTransfer] = useState(null);
  const timeouts = useRef([]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  const amountNum = Number(amount) || 0;
  const price = usdPrice(prices, token.coingeckoId);
  const fromBalance = ledger[fromChain.key]?.[token.symbol] ?? 0;
  const toBalance = ledger[toChain.key]?.[token.symbol] ?? 0;
  const insufficient = amountNum > fromBalance;
  const receiveAmount = amountNum * (1 - DEMO_BRIDGE_FEE);

  const selectFromChain = (chain) => {
    if (chain.key === toChain.key) setToChain(fromChain);
    setFromChain(chain);
  };
  const selectToChain = (chain) => {
    if (chain.key === fromChain.key) setFromChain(toChain);
    setToChain(chain);
  };
  const swapDirection = () => {
    setFromChain(toChain);
    setToChain(fromChain);
  };

  const handleBridge = () => {
    setBusy(true);
    const from = fromChain;
    const to = toChain;
    const symbol = token.symbol;
    const sending = amountNum;
    const received = receiveAmount;

    setTransfer({
      fromChain: from,
      toChain: to,
      amountLabel: `${formatAmount(sending)} ${symbol}`,
      phase: "wallet",
      startedAt: Date.now(),
      demo: true,
    });

    const schedule = (fn, ms) => timeouts.current.push(setTimeout(fn, ms));
    schedule(() => setTransfer((t) => t && { ...t, phase: "origin" }), SIM_WALLET_MS);
    schedule(() => setTransfer((t) => t && { ...t, phase: "transit" }), SIM_WALLET_MS + SIM_CONFIRM_MS);
    schedule(() => {
      setTransfer(
        (t) =>
          t && {
            ...t,
            phase: "arrived",
            receivedLabel: `${formatAmount(received)} ${symbol}`,
          }
      );
      moveDemoFunds({ fromKey: from.key, toKey: to.key, symbol, amount: sending, received });
      toast.success(
        "Cargo delivered",
        `${formatAmount(received)} ${symbol} landed on ${to.name}.`
      );
      setAmount("");
      setBusy(false);
    }, SIM_WALLET_MS + SIM_CONFIRM_MS + SIM_TRANSIT_MS);
  };

  const button = (() => {
    if (amountNum <= 0) return { label: "Enter an amount", disabled: true };
    if (insufficient) return { label: `Insufficient ${token.symbol} on ${fromChain.shortName}`, disabled: true };
    if (busy) return { label: "In transit…", loading: true, disabled: true };
    return { label: "Initiate transfer", onClick: handleBridge };
  })();

  return (
    <div>
      {/* route */}
      <div className="flex items-end gap-2">
        <ChainSelect chains={demoChains} selected={fromChain} onSelect={selectFromChain} label="Origin" />
        <motion.button
          whileHover={{ rotate: 180, scale: 1.06 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          onClick={swapDirection}
          className="mb-0.5 shrink-0 rounded-lg border border-lime-300/25 bg-lime-400/[0.06] p-2.5 text-lime-300 transition-colors hover:border-lime-300/60"
          aria-label="Reverse route"
        >
          <ArrowUpDown size={15} className="rotate-90" />
        </motion.button>
        <ChainSelect chains={demoChains} selected={toChain} onSelect={selectToChain} label="Destination" />
      </div>

      {/* amount + token */}
      <div className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 transition-colors focus-within:border-lime-300/40 hover:border-white/[0.15]">
        <div className="mb-2 flex items-center justify-between">
          <HudLabel>Cargo</HudLabel>
          <button
            onClick={() => setAmount(String(Number(fromBalance.toPrecision(8))))}
            className="font-mono text-[10px] uppercase tracking-wider text-white/40 transition-colors hover:text-lime-300"
          >
            Hold: {formatAmount(fromBalance)} <span className="font-bold text-lime-300/80">MAX</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(e) => isValidAmountInput(e.target.value) && setAmount(e.target.value)}
            className={`w-full min-w-0 flex-1 bg-transparent font-display text-3xl font-semibold tabular-nums outline-none placeholder:text-white/20 ${
              insufficient ? "text-rose-400" : "text-white"
            }`}
          />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setTokenModalOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-full border border-lime-300/25 bg-lime-400/[0.07] py-1.5 pl-2 pr-3 transition-colors hover:border-lime-300/50"
          >
            <Logo src={token.img} alt={token.symbol} size={22} />
            <span className="text-sm font-semibold text-white">{token.symbol}</span>
            <ChevronDown size={13} className="text-white/50" />
          </motion.button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-1.5">
            {[25, 50, 75].map((pct) => (
              <button
                key={pct}
                onClick={() => setAmount(String(Number(((fromBalance * pct) / 100).toPrecision(8))))}
                className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/45 transition-colors hover:border-lime-300/40 hover:text-lime-200"
              >
                {pct}%
              </button>
            ))}
          </div>
          <span className="font-mono text-[11px] tabular-nums text-white/35">
            {price !== null && amountNum > 0 ? formatUsd(amountNum * price) : ""}
          </span>
        </div>
      </div>

      {/* flight plan */}
      <div className="mt-4 space-y-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
        <InfoRow label={`Arrives on ${toChain.shortName}`}>
          {amountNum > 0 ? `${formatAmount(receiveAmount)} ${token.symbol}` : "—"}
        </InfoRow>
        <InfoRow label="Toll">{DEMO_BRIDGE_FEE * 100}%</InfoRow>
        <InfoRow label="Route">
          <span className="flex items-center justify-end gap-1.5">
            <Orbit size={11} className="text-lime-300" /> Galactic hyperlane
          </span>
        </InfoRow>
        <InfoRow label="Flight time">
          <span className="flex items-center justify-end gap-1.5">
            <Clock size={11} className="text-cyan-300" /> ~6 s (simulated)
          </span>
        </InfoRow>
        <InfoRow label={`${toChain.shortName} hold`}>
          {formatAmount(toBalance)} {token.symbol}
        </InfoRow>
      </div>

      <div className="mt-4">
        <LaunchButton onClick={button.onClick} disabled={button.disabled} loading={button.loading}>
          {button.label}
        </LaunchButton>
      </div>

      <AnimatePresence>
        {transfer && <TransferTracker transfer={transfer} onDismiss={() => setTransfer(null)} />}
      </AnimatePresence>

      <TokenSelect
        open={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        onSelect={(t) => {
          setToken(t);
          setTokenModalOpen(false);
        }}
        selected={token}
        tokens={demoTokens}
        balances={ledger[fromChain.key]}
        prices={prices}
      />
    </div>
  );
}
