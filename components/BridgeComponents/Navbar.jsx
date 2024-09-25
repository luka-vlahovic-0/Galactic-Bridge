import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import alienLogo from "../../public/assets/alienLogo.png";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex flex-row items-center justify-between p-2 px-4 bg-[#28293d]">
      <div className="flex flex-row items-center space-x-4">
      <Link href="/">
          <div id="logoName" className="flex flex-row items-center gap-2">
            {/* Logo bez teksta za medium/small ekrane */}

            <Image
              src={alienLogo}
              alt="Alien Logo"
              className="w-16 h-16"
              draggable="false"
            />

            {/* Tekst vidljiv samo na velikim ekranima */}
            <p className="text-[22px] text-white font-semibold select-none ml-[-10px] hidden md:block">
              Galactic Bridge
            </p>
          </div>
        </Link>
        {/* Opcije vidljive samo na velikim ekranima */}
      </div>

      {/* Connect dugme i meni ikonica */}
      <div className="flex items-center gap-4">
        <ConnectButton accountStatus={"address"} />
        {/* Meni ikonica za medium/small ekrane */}
        
      </div>
    </div>
  );
}
