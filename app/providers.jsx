"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "../lib/wagmi";
import { ModeProvider } from "../context/ModeContext";
import { ToastProvider } from "../context/ToastContext";

const queryClient = new QueryClient();

const theme = darkTheme({
  accentColor: "#a3e635",
  accentColorForeground: "#04120a",
  borderRadius: "medium",
  overlayBlur: "small",
});

export default function Providers({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme} modalSize="compact">
          <ModeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ModeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
