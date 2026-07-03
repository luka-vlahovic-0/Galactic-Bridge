// Demo-mode universe: simulated execution over local balances, but with
// LIVE market prices from CoinGecko so quotes feel real. Balances are kept
// per chain so a bridge visibly moves funds between networks.

const TW = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains";
const LIFI = "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains";

export const demoChains = [
  { key: "ethereum", name: "Ethereum", shortName: "Ethereum", img: `${LIFI}/ethereum.svg`, accent: "#627eea", eta: "~14 min" },
  { key: "base", name: "Base", shortName: "Base", img: `${LIFI}/base.svg`, accent: "#0052ff", eta: "~20 s" },
  { key: "arbitrum", name: "Arbitrum One", shortName: "Arbitrum", img: `${LIFI}/arbitrum.svg`, accent: "#12aaff", eta: "~30 s" },
  { key: "optimism", name: "Optimism", shortName: "Optimism", img: `${LIFI}/optimism.svg`, accent: "#ff0420", eta: "~20 s" },
  { key: "polygon", name: "Polygon", shortName: "Polygon", img: `${LIFI}/polygon.svg`, accent: "#8247e5", eta: "~40 s" },
  { key: "bsc", name: "BNB Chain", shortName: "BNB", img: `${LIFI}/bsc.svg`, accent: "#f0b90b", eta: "~30 s" },
  { key: "avalanche", name: "Avalanche", shortName: "Avax", img: `${LIFI}/avalanche.svg`, accent: "#e84142", eta: "~15 s" },
  { key: "linea", name: "Linea", shortName: "Linea", img: `${LIFI}/linea.svg`, accent: "#61dfff", eta: "~30 s" },
];

export const demoTokens = [
  { symbol: "ETH", name: "Ethereum", coingeckoId: "ethereum", starter: 1.2, img: `${TW}/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png` },
  { symbol: "WBTC", name: "Wrapped Bitcoin", coingeckoId: "wrapped-bitcoin", starter: 0.04, img: `${TW}/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png` },
  { symbol: "USDC", name: "USD Coin", coingeckoId: "usd-coin", starter: 2500, img: `${TW}/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png` },
  { symbol: "USDT", name: "Tether", coingeckoId: "tether", starter: 1500, img: `${TW}/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png` },
  { symbol: "DAI", name: "Dai Stablecoin", coingeckoId: "dai", starter: 800, img: `${TW}/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png` },
  { symbol: "LINK", name: "Chainlink", coingeckoId: "chainlink", starter: 60, img: `${TW}/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png` },
  { symbol: "UNI", name: "Uniswap", coingeckoId: "uniswap", starter: 90, img: `${TW}/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png` },
  { symbol: "ARB", name: "Arbitrum", coingeckoId: "arbitrum", starter: 500, img: `${TW}/arbitrum/assets/0x912CE59144191C1204E64559FE8253a0e49E6548/logo.png` },
];

export const DEMO_BRIDGE_FEE = 0.0005; // 0.05%

// How much of each token's starter stack each chain begins with.
const CHAIN_WEIGHT = {
  ethereum: 1,
  base: 0.55,
  arbitrum: 0.45,
  optimism: 0.35,
  polygon: 0.3,
  bsc: 0.25,
  avalanche: 0.2,
  linea: 0.15,
};

/** { [chainKey]: { [symbol]: amount } } */
export const starterLedger = Object.fromEntries(
  demoChains.map((chain) => [
    chain.key,
    Object.fromEntries(
      demoTokens.map((token) => [
        token.symbol,
        Number((token.starter * (CHAIN_WEIGHT[chain.key] ?? 0.25)).toPrecision(4)),
      ])
    ),
  ])
);
