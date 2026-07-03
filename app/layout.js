import "./globals.css";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Providers from "./providers";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-display" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Galactic Bridge | Interchain Transit Authority",
  description:
    "Bridge assets across the galaxy. A slick cross-chain bridge with a full demo simulation and real testnet transfers between Sepolia and its L2s.",
  icons: { icon: "/assets/alienLogo.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${grotesk.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[#02030a] font-sans text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
