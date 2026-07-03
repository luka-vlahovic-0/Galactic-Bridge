"use client";

import { useCallback, useEffect, useState } from "react";
import { allTestnetChains } from "../lib/chains";
import { readClient } from "../lib/bridge";

const REFRESH_MS = 15000;

/** Native ETH balances on every supported testnet: { [chainKey]: bigint | null } */
export function useTestnetBalances(address) {
  const [balances, setBalances] = useState({});

  const refresh = useCallback(async () => {
    if (!address) {
      setBalances({});
      return;
    }
    const entries = await Promise.all(
      allTestnetChains.map(async (chain) => {
        try {
          const balance = await readClient(chain.key).getBalance({ address });
          return [chain.key, balance];
        } catch {
          return [chain.key, null]; // transient RPC failure
        }
      })
    );
    setBalances((prev) => {
      const next = { ...prev };
      for (const [key, value] of entries) {
        if (value !== null || next[key] === undefined) next[key] = value;
      }
      return next;
    });
  }, [address]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { balances, refresh };
}
