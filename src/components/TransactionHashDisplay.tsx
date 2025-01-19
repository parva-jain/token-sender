import { useEffect, useState } from "react";

interface TransactionHashDisplayProps {
  hash: `0x${string}` | undefined;
  isReplaced: boolean;
  newHash: `0x${string}` | undefined;
}

export function TransactionHashDisplay({
  hash,
  isReplaced,
  newHash,
}: TransactionHashDisplayProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Reseting visibility when either hash changes
    setVisible(true);

    // Starting timer if we have either a valid hash or newHash
    if ((hash && hash !== "0x") || (newHash && newHash !== "0x")) {
      const timer = setTimeout(() => {
        setVisible(false);
        // Clearing from localStorage
        localStorage.removeItem("currentTransactionHash");
        localStorage.removeItem("newTransactionHash");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [hash, newHash]);

  if (!hash || hash === "0x") return null;

  if (!visible) return null;

  return (
    <div className="mt-4">
      <div className="p-3 bg-green-50 border border-green-200">
        <p className="text-sm font-medium text-green-800">Transaction Hash:</p>
        <p className="text-xs text-green-600 break-all mt-1">{hash}</p>
      </div>

      {isReplaced && newHash && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-800">
            Transaction Replaced on Wallet:
          </p>
          <p className="text-xs text-yellow-600 break-all mt-1">{newHash}</p>
        </div>
      )}
    </div>
  );
}
