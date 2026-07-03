# 🛸 Galactic Bridge

A galaxy-themed cross-chain bridge with a fully animated SVG space scene — twinkling stars, a
rotating spiral galaxy, looping comets, a ringed planet, and an alien saucer running its
abduction loop in the corner.

## Modes

Use the **Demo / Testnet** toggle in the navbar:

- **Demo** — a complete bridge simulation with no wallet required. Local per-chain token
  balances (persisted in `localStorage`), live market prices from CoinGecko, a simulated
  transfer timeline with a mission-log tracker, and a one-click reset.
- **Testnet** — real on-chain bridging with your wallet (MetaMask etc.):
  - **Sepolia → L2** rides each chain's official native bridge (OP Standard Bridge for
    Base/OP Sepolia, the Delayed Inbox for Arbitrum Sepolia).
  - **L2 ↔ L2 and L2 → Sepolia** are relayed by [Across Protocol's testnet](https://testnet.across.to)
    — small amounts fill in seconds.
  - Arrival is detected by watching your destination balance, with the tx linked on the explorer.

Supported testnets: Sepolia, Base Sepolia, OP Sepolia, Arbitrum Sepolia. Grab free Sepolia ETH
from the [Google faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia).

## Stack

Next.js 14 (app router) · Tailwind CSS · framer-motion · viem · lucide-react

## Run it

```bash
npm install
npm run dev
```

No env vars needed. Testnet mode only requires a browser wallet.
