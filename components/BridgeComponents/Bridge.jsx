// Importovanje potrebnih modula i fajlova
import { useEffect, useState, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { coins } from "../../coins";
import { chains } from "../../chains";
import Image from "next/image";
import astronaut from "../../public/assets/astronaut.png"; // Uveri se da je putanja ispravna
import spaceship from "../../public/assets/spaceship.png"; // Uveri se da je putanja ispravna
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Bridge() {
  // Stanja za selektovane coine i chainove
  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [isCoinDropdownOpen, setIsCoinDropdownOpen] = useState(false);
  const [selectedChainFrom, setSelectedChainFrom] = useState(chains[0]);
  const [selectedChainTo, setSelectedChainTo] = useState(chains[1]); // Promenjeno na chains[1]
  const [isChainDropdownOpenFrom, setIsChainDropdownOpenFrom] = useState(false);
  const [isChainDropdownOpenTo, setIsChainDropdownOpenTo] = useState(false);
  const [amountFrom, setAmountFrom] = useState(""); // Stanje za prvi input
  const [amountTo, setAmountTo] = useState("0");

  const dropdownRefs = useRef({
    coin: null,
    chainFrom: null,
    chainTo: null,
  });

  // Filtriranje chain-ova za "To" dropdown
  const filteredChainsForTo = chains.filter(
    (chain) => chain.name !== selectedChainFrom.name
  );

  // Filtriranje chain-ova za "From" dropdown
  const filteredChainsForFrom = chains.filter(
    (chain) => chain.name !== selectedChainTo.name
  );

  useEffect(() => {
    const parsedAmount = parseFloat(amountFrom);
    if (!isNaN(parsedAmount)) {
      const reducedAmount = (parsedAmount * (1 - 0.173)).toFixed(2); // Smanjenje od 17.3%
      setAmountTo(reducedAmount);
    } else {
      setAmountTo("0");
    }
  }, [amountFrom]);

  // Event listener za zatvaranje dropdown-a
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefs.current.coin &&
        !dropdownRefs.current.coin.contains(event.target)
      ) {
        setIsCoinDropdownOpen(false);
      }
      if (
        dropdownRefs.current.chainFrom &&
        !dropdownRefs.current.chainFrom.contains(event.target)
      ) {
        setIsChainDropdownOpenFrom(false);
      }
      if (
        dropdownRefs.current.chainTo &&
        !dropdownRefs.current.chainTo.contains(event.target)
      ) {
        setIsChainDropdownOpenTo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const bridgeToast = () => {
    toast.success(
      `Successfully bridged ${amountFrom} ${selectedCoin.name} to ${selectedChainTo.name}. 🚀`,
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );
  };

  return (
    <div className="relative mt-16 px-4 md:px-0 mb-36 md:mb-0">
      {/* Astronaut slika levo */}
      <div className="absolute top-0 left-0 hidden lg:block">
        <Image
          src={astronaut}
          alt="Astronaut"
          className="w-40 object-cover h-36 mt-[275px] ml-[120px]"
          draggable="false"
        />
      </div>

      <div className="bg-[#1e1f2b] p-8 rounded-lg max-w-lg mx-auto shadow-lg relative z-10">
        {/* Token Selection */}
        <div
          className="relative mb-6"
          ref={(el) => (dropdownRefs.current.coin = el)}
        >
          <div className="flex items-center mb-3">
            <span className="text-white text-lg font-mono font-semibold">
              Token
            </span>
            <div
              onClick={() => setIsCoinDropdownOpen(!isCoinDropdownOpen)}
              className="flex ml-6 items-center justify-between bg-[#2a2c42] rounded-lg px-3 py-3 cursor-pointer max-w-xs"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 relative aspect-w-1 aspect-h-1">
                  <Image
                    src={selectedCoin.img}
                    alt={selectedCoin.name}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-full"
                  />
                </div>
                <span className="text-white font-semibold font-mono text-lg px-2">
                  {selectedCoin.name}
                </span>
              </div>
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {isCoinDropdownOpen && (
            <div className="absolute bg-[#2a2c42] rounded-lg mt-1 w-full z-10">
              {coins.map((coin) => (
                <div
                  key={coin.name}
                  onClick={() => {
                    setSelectedCoin(coin);
                    setIsCoinDropdownOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#33354a] cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={coin.img}
                      alt={coin.name}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <span className="text-white font-mono font-semibold text-lg">
                      {coin.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chain Selection "From" */}
        <div
          className="relative mt-6"
          ref={(el) => (dropdownRefs.current.chainFrom = el)}
        >
          <div
            onClick={() => setIsChainDropdownOpenFrom(!isChainDropdownOpenFrom)}
            className="flex items-center justify-between bg-[#2a2c42] rounded-lg px-4 py-3 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Image
                src={selectedChainFrom.img}
                alt={selectedChainFrom.name}
                width={30}
                height={30}
                className="rounded-full"
              />
              <span className="text-white font-semibold font-mono text-lg">
                {selectedChainFrom.name}
              </span>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </div>
          {isChainDropdownOpenFrom && (
            <div className="absolute bg-[#2a2c42] rounded-lg mt-1 w-full z-10">
              {filteredChainsForFrom.map((chain) => (
                <div
                  key={chain.name}
                  onClick={() => {
                    setSelectedChainFrom(chain);
                    setIsChainDropdownOpenFrom(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#33354a] cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={chain.img}
                      alt={chain.name}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <span className="text-white text-lg">{chain.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Polje "From" */}
        <input
          type="text"
          placeholder="Enter amount"
          className="w-full mt-3 bg-[#2a2c42] p-3 font-mono rounded-lg text-white text-lg focus:outline-none"
          pattern="[0-9]*"
          value={amountFrom}
          onInput={(e) => {
            let value = e.target.value.replace(/[^0-9.]/g, "");
            const parts = value.split(".");
            if (parts.length > 2) {
              value = parts[0] + "." + parts.slice(1).join("");
            }
            setAmountFrom(value);
          }}
        />

        {/* Chain Selection "To" */}
        <div
          className="relative mt-6"
          ref={(el) => (dropdownRefs.current.chainTo = el)}
        >
          <div
            onClick={() => setIsChainDropdownOpenTo(!isChainDropdownOpenTo)}
            className="flex items-center justify-between bg-[#2a2c42] rounded-lg px-4 py-3 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Image
                src={selectedChainTo.img}
                alt={selectedChainTo.name}
                width={30}
                height={30}
                className="rounded-full"
              />
              <span className="text-white font-semibold font-mono text-lg">
                {selectedChainTo.name}
              </span>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </div>
          {isChainDropdownOpenTo && (
            <div className="absolute bg-[#2a2c42] rounded-lg mt-1 w-full z-10">
              {filteredChainsForTo.map((chain) => (
                <div
                  key={chain.name}
                  onClick={() => {
                    setSelectedChainTo(chain);
                    setIsChainDropdownOpenTo(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#33354a] cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={chain.img}
                      alt={chain.name}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <span className="text-white text-lg">{chain.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Polje "To" */}
        <input
          type="text"
          placeholder="Amount (After Fees)"
          className="w-full mt-3 bg-[#2a2c42] p-3 font-mono rounded-lg text-white text-lg focus:outline-none"
          value={amountTo}
          disabled
        />

        {/* Send Button */}
        <button
          onClick={bridgeToast}
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold font-mono text-lg"
        >
          Bridge
        </button>
      </div>
      <ToastContainer />

      {/* Spaceship slika desno */}
      <div className="absolute top-0 right-0 hidden lg:block">
        <Image
          src={spaceship}
          alt="Spaceship"
          className="w-48 object-cover h-44 mt-[140px] mr-[160px] rotate-[25deg]"
          draggable="false"
        />
      </div>
    </div>
  );
}
