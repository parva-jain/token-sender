interface TransactionHashDisplayProps {
  hash: `0x${string}` | undefined;
  isReplaced: boolean;
  newHash: `0x${string}` | undefined;
}

export function TransactionHashDisplay({ hash, isReplaced, newHash }: TransactionHashDisplayProps) {
  if (!hash) return null;

  return (
    <div className="mt-4">
      <div className="p-3 bg-green-50 border border-green-200">
        <p className="text-sm font-medium text-green-800">Transaction Hash:</p>
        <p className="text-xs text-green-600 break-all mt-1">{hash}</p>
      </div>
      
      {isReplaced && newHash && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-800">Transaction Replaced on Wallet:</p>
          <p className="text-xs text-yellow-600 break-all mt-1">{newHash}</p>
        </div>
      )}
    </div>
  );
} 