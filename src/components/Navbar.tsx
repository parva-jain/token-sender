import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  // to fetch account information and disconnect function from wagmi
  const account = useAccount();
  const { disconnect } = useDisconnect();

  // Function to handle user disconnect action
  const handleDisconnect = () => {
    // Clear local storage values and disconnect
    localStorage.clear();
    disconnect();
  };

  return (
    <nav className="flex flex-col justify-evenly sm:flex-row border-b-2 bg-white sm:justify-between items-center p-4 font-roboto  h-[120px] sm:h-[60px]">
      <div className="text-xl w-fit text-gray-700 font-light">
        ERC20 Token Transfer
      </div>
      <div className="w-fit ">
        {account.status === "connected" ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">
              {account.addresses?.[0]?.slice(0, 6)}...
              {account.addresses?.[0]?.slice(-4)}
            </span>
            <button
              onClick={handleDisconnect}
              className="bg-red-400 px-4 py-2 text-white rounded"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <ConnectButton />
        )}
      </div>
    </nav>
  );
}
