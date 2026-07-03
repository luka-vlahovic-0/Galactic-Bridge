import GalaxyBackground from "../components/GalaxyBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BridgeConsole from "../components/BridgeConsole";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <GalaxyBackground />
      <Navbar />
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <BridgeConsole />
      </main>
      <Footer />
    </div>
  );
}
