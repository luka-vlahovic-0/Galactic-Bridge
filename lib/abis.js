import { parseAbi } from "viem";

// OP Stack L1StandardBridge (Base Sepolia / OP Sepolia deposits)
export const L1_STANDARD_BRIDGE_ABI = parseAbi([
  "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable",
]);

// Arbitrum delayed inbox (Arbitrum Sepolia deposits)
export const ARB_INBOX_ABI = parseAbi([
  "function depositEth() payable returns (uint256)",
]);

// Across Protocol V3 SpokePool (L2 <-> L2 / L2 -> L1 transfers)
export const SPOKE_POOL_ABI = parseAbi([
  "function depositV3(address depositor, address recipient, address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 destinationChainId, address exclusiveRelayer, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes message) payable",
]);
