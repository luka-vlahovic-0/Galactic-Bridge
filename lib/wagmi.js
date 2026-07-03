import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { allTestnetChains } from "./chains";

const projectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_KEY ?? "e13bdbd6cc8f6a15b9660c944185c8a7";

export const wagmiConfig = getDefaultConfig({
  appName: "Galactic Bridge",
  projectId,
  chains: allTestnetChains.map((c) => c.viemChain),
  transports: Object.fromEntries(allTestnetChains.map((c) => [c.chainId, http(c.rpcUrl)])),
  ssr: true,
});
