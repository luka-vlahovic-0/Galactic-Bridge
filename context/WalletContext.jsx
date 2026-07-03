"use client";

// Thin adapter over wagmi + RainbowKit so the rest of the app keeps a single
// useWallet() API. Connection UX (wallet list, WalletConnect, account modal)
// is fully handled by RainbowKit.

import { useCallback } from "react";
import { useAccount, useDisconnect, useSwitchChain, useWalletClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function useWallet() {
  const { address, chainId, isConnecting } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();

  const connect = useCallback(() => openConnectModal?.(), [openConnectModal]);

  const switchChain = useCallback(
    (chain) => switchChainAsync({ chainId: chain.chainId }),
    [switchChainAsync]
  );

  const getWalletClient = useCallback(() => {
    if (!walletClient) throw new Error("Wallet not connected");
    return walletClient;
  }, [walletClient]);

  return {
    address,
    chainId,
    connecting: isConnecting,
    hasWallet: true,
    connect,
    disconnect,
    switchChain,
    getWalletClient,
  };
}
