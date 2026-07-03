"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { parseUnits, formatUnits } from "viem";
import { ArrowUpDown, Clock, ShieldCheck, Zap, Droplets } from "lucide-react";
import { allTestnetChains, testnetChains } from "../lib/chains";
import { bridgeRoute, bridgeEthNative, bridgeEthAcross, getAcrossQuote, readClient } from "../lib/bridge";
import { formatAmount, formatUsd, isValidAmountInput } from "../lib/format";
import { useWallet } from "../context/WalletContext";
import { useToast } from "../context/ToastContext";
import { useTestnetBalances } from "../hooks/useTestnetBalances";
import { usdPrice } from "../hooks/usePrices";
import { LaunchButton, InfoRow, HudLabel } from "./ui";
import ChainSelect from "./ChainSelect";
import TransferTracker from "./TransferTracker";

const ETH_GAS_BUFFER = parseUnits("0.003", 18);
const PRESETS = ["0.001", "0.002", "0.005", "0.01"];
const ARRIVAL_POLL_MS = 5000;
const ARRIVAL_TIMEOUT_MS = 20 * 60 * 1000;

export default function TestnetBridge({ prices }) {
  const { address, chainId, connect, switchChain, getWalletClient } = useWallet();
  const toast = useToast();
  const { balances, refresh: refreshBalances } = useTestnetBalances(address);

  const [fromChain, setFromChain] = useState(testnetChains.sepolia);
  const [toChain, setToChain] = useState(testnetChains.baseSepolia);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [acrossQuote, setAcrossQuote] = useState(null);
  const [quoteError, setQuoteError] = useState(null);
  const [quoting, setQuoting] = useState(false);
  const [transfer, setTransfer] = useState(null);
  const pollRef = useRef(null);
  const quoteSeq = useRef(0);

  const route = bridgeRoute(fromChain);
  const isAcross = route === "across";

  const amountIn = useMemo(() => {
    if (!amount || amount === ".") return 0n;
    try {
      return parseUnits(amount, 18);
    } catch {
      return 0n;
    }
  }, [amount]);

  const fromBalance = balances[fromChain.key];
  const insufficient = fromBalance !== undefined && fromBalance !== null && amountIn > fromBalance;
  const onFromChain = chainId === fromChain.chainId;
  const ethUsd = usdPrice(prices, "ethereum");
  const amountNum = Number(amount) || 0;
  const receiveAmount = isAcross ? acrossQuote?.outputAmount ?? null : amountIn;

  // stop arrival polling on unmount
  useEffect(() => () => clearInterval(pollRef.current), []);

  // ---- Across quoting (debounced) ----------------------------------------
  const fetchQuote = useCallback(async () => {
    if (!isAcross || amountIn === 0n) {
      setAcrossQuote(null);
      setQuoteError(null);
      return;
    }
    const seq = ++quoteSeq.current;
    setQuoting(true);
    try {
      const quote = await getAcrossQuote({ fromChain, toChain, amount: amountIn });
      if (seq !== quoteSeq.current) return;
      setAcrossQuote(quote);
      setQuoteError(null);
    } catch (error) {
      if (seq !== quoteSeq.current) return;
      setAcrossQuote(null);
      setQuoteError(error.message);
    } finally {
      if (seq === quoteSeq.current) setQuoting(false);
    }
  }, [isAcross, amountIn, fromChain, toChain]);

  useEffect(() => {
    const debounce = setTimeout(fetchQuote, 400);
    return () => clearTimeout(debounce);
  }, [fetchQuote]);

  // ---- chain pickers -------------------------------------------------------
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

  const setMax = () => {
    if (fromBalance === undefined || fromBalance === null) return;
    const max = fromBalance > ETH_GAS_BUFFER ? fromBalance - ETH_GAS_BUFFER : 0n;
    setAmount(formatUnits(max, 18));
  };

  // ---- arrival detection ---------------------------------------------------
  const watchArrival = useCallback(
    (destChain, balanceBefore) => {
      clearInterval(pollRef.current);
      const startedWatching = Date.now();
      const destClient = readClient(destChain.key);
      pollRef.current = setInterval(async () => {
        try {
          const balance = await destClient.getBalance({ address });
          if (balance > balanceBefore) {
            clearInterval(pollRef.current);
            const received = balance - balanceBefore;
            setTransfer((t) =>
              t ? { ...t, phase: "arrived", receivedLabel: `${formatAmount(received, 18)} ETH` } : t
            );
            toast.success("Cargo delivered", `${formatAmount(received, 18)} ETH landed on ${destChain.name}.`);
            refreshBalances();
          } else if (Date.now() - startedWatching > ARRIVAL_TIMEOUT_MS) {
            clearInterval(pollRef.current);
            setTransfer((t) =>
              t
                ? {
                    ...t,
                    error:
                      "Taking longer than expected. Your funds are safe — check the transaction on the explorer, or your destination balance in a few minutes.",
                  }
                : t
            );
          }
        } catch {
          /* transient RPC error — keep polling */
        }
      }, ARRIVAL_POLL_MS);
    },
    [address, refreshBalances, toast]
  );

  // ---- execution -------------------------------------------------------------
  const handleBridge = async () => {
    setBusy(true);
    const from = fromChain;
    const to = toChain;
    const sending = amountIn;
    try {
      const balanceBefore = await readClient(to.key).getBalance({ address });
      setTransfer({
        fromChain: from,
        toChain: to,
        amountLabel: `${formatAmount(sending, 18)} ETH`,
        phase: "wallet",
        explorer: from.explorer,
        startedAt: Date.now(),
      });

      const walletClient = getWalletClient();
      const txHash = isAcross
        ? await bridgeEthAcross({ walletClient, account: address, fromChain: from, toChain: to, amount: sending, quote: acrossQuote })
        : await bridgeEthNative({ walletClient, account: address, destination: to, amount: sending });

      setTransfer((t) => (t ? { ...t, phase: "origin", txHash } : t));

      const receipt = await readClient(from.key).waitForTransactionReceipt({ hash: txHash });
      if (receipt.status !== "success") {
        setTransfer((t) => (t ? { ...t, error: "The transaction reverted on the origin chain." } : t));
        return;
      }

      setAmount("");
      refreshBalances();
      setTransfer((t) => (t ? { ...t, phase: "transit" } : t));
      watchArrival(to, balanceBefore);
    } catch (error) {
      const rejected = error?.code === 4001 || /denied|rejected/i.test(error?.message ?? "");
      if (rejected) {
        setTransfer(null);
      } else {
        setTransfer((t) =>
          t ? { ...t, error: error?.shortMessage || error?.message || "Something went wrong." } : t
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const button = (() => {
    if (!address) return { label: "Connect wallet", onClick: connect };
    if (!onFromChain)
      return { label: `Dock at ${fromChain.name}`, onClick: () => switchChain(fromChain).catch(() => {}) };
    if (amountIn === 0n) return { label: "Enter an amount", disabled: true };
    if (insufficient) return { label: `Insufficient ETH on ${fromChain.shortName}`, disabled: true };
    if (isAcross && quoting && !acrossQuote) return { label: "Plotting route…", disabled: true, loading: true };
    if (isAcross && quoteError) return { label: "Route unavailable", disabled: true };
    if (isAcross && !acrossQuote) return { label: "Enter an amount", disabled: true };
    return { label: "Initiate transfer", onClick: handleBridge, loading: busy };
  })();

  return (
    <div>
      {/* route */}
      <div className="flex items-end gap-2">
        <ChainSelect chains={allTestnetChains} selected={fromChain} onSelect={selectFromChain} label="Origin" />
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
        <ChainSelect chains={allTestnetChains} selected={toChain} onSelect={selectToChain} label="Destination" />
      </div>

      {/* amount */}
      <div className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 transition-colors focus-within:border-lime-300/40 hover:border-white/[0.15]">
        <div className="mb-2 flex items-center justify-between">
          <HudLabel>Cargo (ETH)</HudLabel>
          {address && fromBalance !== undefined && fromBalance !== null && (
            <button
              onClick={setMax}
              className="font-mono text-[10px] uppercase tracking-wider text-white/40 transition-colors hover:text-lime-300"
            >
              Hold: {formatAmount(fromBalance, 18)} <span className="font-bold text-lime-300/80">MAX</span>
            </button>
          )}
        </div>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          onChange={(e) => isValidAmountInput(e.target.value) && setAmount(e.target.value)}
          className={`w-full min-w-0 bg-transparent font-display text-3xl font-semibold tabular-nums outline-none placeholder:text-white/20 ${
            insufficient ? "text-rose-400" : "text-white"
          }`}
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/45 transition-colors hover:border-lime-300/40 hover:text-lime-200"
              >
                {preset}
              </button>
            ))}
          </div>
          <span className="font-mono text-[11px] tabular-nums text-white/35">
            {ethUsd && amountNum > 0 ? formatUsd(amountNum * ethUsd) : ""}
          </span>
        </div>
      </div>

      {/* flight plan */}
      <div className="mt-4 space-y-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
        <InfoRow label={`Arrives on ${toChain.shortName}`}>
          {receiveAmount !== null && amountIn > 0n && (!isAcross || acrossQuote) ? (
            <span className={quoting ? "animate-pulse" : ""}>{formatAmount(receiveAmount, 18)} ETH</span>
          ) : (
            "—"
          )}
        </InfoRow>
        <InfoRow label="Route">
          <span className="flex items-center justify-end gap-1.5">
            {isAcross ? (
              <>
                <Zap size={11} className="text-cyan-300" /> Across Protocol relay
              </>
            ) : (
              <>
                <ShieldCheck size={11} className="text-lime-300" />
                Official {toChain.bridge?.type === "arbitrum" ? "Arbitrum Inbox" : "OP Standard Bridge"}
              </>
            )}
          </span>
        </InfoRow>
        {isAcross && acrossQuote && (
          <InfoRow label="Relayer fee">{formatAmount(acrossQuote.totalFee, 18)} ETH</InfoRow>
        )}
        <InfoRow label="Flight time">
          <span className="flex items-center justify-end gap-1.5">
            <Clock size={11} className="text-cyan-300" />
            {isAcross ? (acrossQuote ? `~${acrossQuote.estimatedFillTimeSec} s` : "~1 min") : toChain.eta}
          </span>
        </InfoRow>
        {address && balances[toChain.key] !== undefined && balances[toChain.key] !== null && (
          <InfoRow label={`${toChain.shortName} hold`}>
            {formatAmount(balances[toChain.key], 18)} ETH
          </InfoRow>
        )}
      </div>

      {quoteError && amountIn > 0n && (
        <p className="mt-3 rounded-lg border border-amber-400/25 bg-amber-400/[0.07] p-3 font-mono text-[11px] leading-relaxed text-amber-300/90">
          {quoteError}
        </p>
      )}

      <div className="mt-4">
        <LaunchButton onClick={button.onClick} disabled={button.disabled} loading={button.loading}>
          {button.label}
        </LaunchButton>
      </div>

      <AnimatePresence>
        {transfer && <TransferTracker transfer={transfer} onDismiss={() => setTransfer(null)} />}
      </AnimatePresence>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
        <Droplets size={13} className="mt-0.5 shrink-0 text-cyan-300/70" />
        <p className="font-mono text-[10px] leading-relaxed text-white/35">
          Need fuel? Grab free Sepolia ETH from the{" "}
          <a
            href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300/80 underline decoration-dotted hover:text-cyan-200"
          >
            Google faucet
          </a>
          . Sepolia → L2 rides the official native bridge; L2 ↔ L2 is relayed by Across — small
          amounts fill in seconds.
        </p>
      </div>
    </div>
  );
}
