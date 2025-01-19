import React, { useEffect } from "react";
import { getAddress } from "viem";

interface TransferFormProps {
  isTokenAddressVerified: boolean;
  recipient: string;
  setRecipient: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  walletBalance: number;
  decimal: number;
  isPending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const validAddress = (address: string) => {
  try {
    getAddress(address);
    return true;
  } catch (error) {
    return false;
  }
};

export function TransferForm({
  isTokenAddressVerified,
  recipient,
  setRecipient,
  amount,
  setAmount,
  walletBalance,
  isPending,
  onSubmit,
}: TransferFormProps) {
  // Effect to clear recipient and amount when token address is not verified
  useEffect(() => {
    if (!isTokenAddressVerified) {
      setRecipient("");
      setAmount("");
      localStorage.removeItem("recipient");
      localStorage.removeItem("amount");
    }
  }, [isTokenAddressVerified]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <input
          disabled={!isTokenAddressVerified}
          name="recipient"
          type="text"
          placeholder="Recipient Address"
          className="w-full p-2.5 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          value={recipient}
          onChange={(e) => {
            setRecipient(e.target.value);
            localStorage.setItem("recipient", e.target.value);
          }}
        />
        <div className="flex">
          <input
            name="amount"
            disabled={!isTokenAddressVerified}
            type="number"
            placeholder="Amount"
            className="w-full p-2.5 border border-gray-300 border-r-[transparent] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              localStorage.setItem("amount", e.target.value);
            }}
          />
          <input
            name="walletBalance"
            disabled
            type="string"
            placeholder="Avl Bal 0.00"
            className="w-full p-2.5 border text-gray-500 border-gray-300 border-l-[transparent] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            value={`(Avl Bal ${walletBalance})`}
            readOnly
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={
          isPending ||
          parseFloat(amount) > walletBalance ||
          !isTokenAddressVerified ||
          !validAddress(recipient)
        }
        className="w-full py-2.5 px-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Sending..." : "Send Token"}
      </button>
    </form>
  );
}
