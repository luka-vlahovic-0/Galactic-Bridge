import { createPublicClient, http } from "viem";
import { L1_STANDARD_BRIDGE_ABI, ARB_INBOX_ABI, SPOKE_POOL_ABI } from "./abis";
import { testnetChains } from "./chains";

const ACROSS_API = "https://testnet.across.to/api";

const publicClients = {};
export function readClient(chainKey) {
  if (!publicClients[chainKey]) {
    const chain = testnetChains[chainKey];
    publicClients[chainKey] = createPublicClient({
      chain: chain.viemChain,
      transport: http(chain.rpcUrl),
    });
  }
  return publicClients[chainKey];
}

/**
 * Route rules:
 *  - Sepolia -> L2: the chain's official native bridge (canonical, always works)
 *  - L2 -> L2 and L2 -> Sepolia: Across Protocol testnet (relayer-filled, fast)
 */
export const bridgeRoute = (fromChain) =>
  fromChain.key === "sepolia" ? "native" : "across";

/**
 * Bridge native ETH from Sepolia to an L2 testnet using the chain's
 * official native bridge. Funds arrive automatically (no claim step).
 * Returns the tx hash.
 */
export async function bridgeEthNative({ walletClient, account, destination, amount }) {
  const { type, address } = destination.bridge;

  if (type === "opstack") {
    return walletClient.writeContract({
      account,
      chain: testnetChains.sepolia.viemChain,
      address,
      abi: L1_STANDARD_BRIDGE_ABI,
      functionName: "bridgeETH",
      args: [200000, "0x"],
      value: amount,
    });
  }

  if (type === "arbitrum") {
    return walletClient.writeContract({
      account,
      chain: testnetChains.sepolia.viemChain,
      address,
      abi: ARB_INBOX_ABI,
      functionName: "depositEth",
      args: [],
      value: amount,
    });
  }

  throw new Error(`Unknown bridge type: ${type}`);
}

/**
 * Quote an Across testnet transfer. Throws with a friendly message when the
 * route is outside the relayers' current limits.
 */
export async function getAcrossQuote({ fromChain, toChain, amount }) {
  const params = new URLSearchParams({
    inputToken: fromChain.weth,
    outputToken: toChain.weth,
    originChainId: String(fromChain.chainId),
    destinationChainId: String(toChain.chainId),
    amount: amount.toString(),
  });
  const res = await fetch(`${ACROSS_API}/suggested-fees?${params}`);
  const data = await res.json();

  if (!res.ok) throw new Error(friendlyAcrossError(data));

  return {
    outputAmount: BigInt(data.outputAmount),
    totalFee: BigInt(data.totalRelayFee.total),
    spokePool: data.spokePoolAddress,
    timestamp: Number(data.timestamp),
    fillDeadline: Number(data.fillDeadline),
    exclusiveRelayer: data.exclusiveRelayer,
    exclusivityDeadline: Number(data.exclusivityDeadline ?? 0),
    estimatedFillTimeSec: Number(data.estimatedFillTimeSec ?? 60),
  };
}

function friendlyAcrossError(data) {
  if (data?.code === "AMOUNT_TOO_HIGH") {
    const max = data.message?.match(/([\d.]+) WETH/)?.[1];
    return max
      ? `Amount exceeds current relayer liquidity — max right now is ${Number(max).toFixed(5)} ETH.`
      : "Amount exceeds current relayer liquidity. Try a smaller amount.";
  }
  if (data?.code === "AMOUNT_TOO_LOW") {
    return "Amount is below the minimum for this route. Try a larger amount.";
  }
  return data?.message || "This route is unavailable right now.";
}

/**
 * Execute an Across testnet ETH transfer. Sends native ETH (the SpokePool
 * wraps it); the recipient receives native ETH on the destination chain.
 * Returns the tx hash.
 */
export async function bridgeEthAcross({ walletClient, account, fromChain, toChain, amount, quote }) {
  return walletClient.writeContract({
    account,
    chain: fromChain.viemChain,
    address: quote.spokePool,
    abi: SPOKE_POOL_ABI,
    functionName: "depositV3",
    args: [
      account,
      account,
      fromChain.weth,
      toChain.weth,
      amount,
      quote.outputAmount,
      BigInt(toChain.chainId),
      quote.exclusiveRelayer,
      quote.timestamp,
      quote.fillDeadline,
      quote.exclusivityDeadline,
      "0x",
    ],
    value: amount,
  });
}
