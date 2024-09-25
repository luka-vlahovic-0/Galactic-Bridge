
import Footer from "@/components/BridgeComponents/Footer";
import Navbar from "@/components/BridgeComponents/Navbar";
import Image from "next/image";
import craterBG from "../public/assets/kraterPozadina.png";
import BridgeWrapper from "@/components/BridgeComponents/BridgeWrapper";

export const metadata = {
  title: "Galactic Bridge | Bridging Made Simple",
  description:
    "Seamlessly transfer your digital assets across multiple blockchains with Galactic Bridge, the ultimate solution for secure and efficient crypto bridging.",
  icons: {
    icon: "/assets/alienlogo.png",
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#28293d]">
      <Navbar />
      <BridgeWrapper/>
      <Footer />
      <div className="absolute bottom-0 left-0 w-full hidden lg:block">
        <Image
          src={craterBG}
          alt="Pozadinska slika"
          className="w-full object-cover h-96 z-[-1]"
          draggable="false"
        />
      </div>
    </div>
  );
}
