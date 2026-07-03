// Testnet chain registry. Sepolia is the L1 hub; the L2 testnets are
// reachable via their official native bridges (L1 -> L2) or Across (L2 <-> L2).

import { sepolia, baseSepolia, optimismSepolia, arbitrumSepolia } from "viem/chains";

const LIFI = "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains";

export const testnetChains = {
  sepolia: {
    key: "sepolia",
    chainId: 11155111,
    hexChainId: "0xaa36a7",
    viemChain: sepolia,
    name: "Sepolia",
    shortName: "Sepolia",
    layer: "Ethereum L1",
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    explorer: "https://sepolia.etherscan.io",
    img: `${LIFI}/ethereum.svg`,
    accent: "#627eea",
    weth: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
  },
  baseSepolia: {
    key: "baseSepolia",
    chainId: 84532,
    hexChainId: "0x14a34",
    viemChain: baseSepolia,
    name: "Base Sepolia",
    shortName: "Base",
    layer: "OP Stack L2",
    rpcUrl: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    img: `${LIFI}/base.svg`,
    accent: "#0052ff",
    weth: "0x4200000000000000000000000000000000000006",
    // Official Base Sepolia L1StandardBridge (deployed on Sepolia)
    bridge: { type: "opstack", address: "0xfd0Bf71F60660E2f608ed56e1659C450eB113120" },
    eta: "~2 min",
  },
  opSepolia: {
    key: "opSepolia",
    chainId: 11155420,
    hexChainId: "0xaa37dc",
    viemChain: optimismSepolia,
    name: "OP Sepolia",
    shortName: "Optimism",
    layer: "OP Stack L2",
    rpcUrl: "https://sepolia.optimism.io",
    explorer: "https://sepolia-optimism.etherscan.io",
    img: `${LIFI}/optimism.svg`,
    accent: "#ff0420",
    weth: "0x4200000000000000000000000000000000000006",
    bridge: { type: "opstack", address: "0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1" },
    eta: "~2 min",
  },
  arbSepolia: {
    key: "arbSepolia",
    chainId: 421614,
    hexChainId: "0x66eee",
    viemChain: arbitrumSepolia,
    name: "Arbitrum Sepolia",
    shortName: "Arbitrum",
    layer: "Arbitrum Rollup",
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    explorer: "https://sepolia.arbiscan.io",
    img: `${LIFI}/arbitrum.svg`,
    accent: "#12aaff",
    weth: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
    // Official Arbitrum Sepolia delayed inbox (deployed on Sepolia)
    bridge: { type: "arbitrum", address: "0xaAe29B0366299461418F5324a79Afc425BE5ae21" },
    eta: "~10 min",
  },
};

export const allTestnetChains = Object.values(testnetChains);

export const chainById = (chainId) =>
  allTestnetChains.find((c) => c.chainId === Number(chainId));

export const addChainParams = (chain) => ({
  chainId: chain.hexChainId,
  chainName: chain.name,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: [chain.rpcUrl],
  blockExplorerUrls: [chain.explorer],
});
