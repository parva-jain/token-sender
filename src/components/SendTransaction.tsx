import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { getAddress } from "viem";
import { abi } from "../utils/erc20ABI";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TokenAddressInput } from './TokenAddressInput';
import { TransferForm } from './TransferForm';
import { TransactionHashDisplay } from './TransactionHashDisplay';
import { useTransactionState } from '../hooks/useTransactionState';
import { useWalletBalance } from '../hooks/useWalletBalance';

export function SendTransaction() {
  // State variables for managing transaction data and UI state
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isReplaced, setIsReplaced] = useState(() => localStorage.getItem("isReplaced") === "true");
  const [newHash, setNewHash] = useState(() => localStorage.getItem("newHash") || "");
  const [isTokenAddressVerified, setIsTokenAddressVerified] = useState(() => {
    const stored = localStorage.getItem("isTokenAddressVerified");
    return stored === "true";
  });
  const [localIsPending, setLocalIsPending] = useState(() => localStorage.getItem("isPending") === "true");

  // Fetch wallet balance and decimal based on token address
  const { walletBalance, decimal } = useWalletBalance(tokenAddress, isTokenAddressVerified);
  const { data: hash, error, writeContract, isPending } = useWriteContract();

  // State for displaying the current transaction hash
  const [displayHash, setDisplayHash] = useState<`0x${string}`>(() => 
    localStorage.getItem('currentTransactionHash') as `0x${string}` || undefined
  );

  // Effect to update local storage with the current transaction hash
  useEffect(() => {
    if (hash) {
      localStorage.setItem('currentTransactionHash', hash);
    }
  }, [hash]);

  // Effect to handle changes in local storage for transaction hash
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentTransactionHash' && e.newValue) {
        setDisplayHash(e.newValue as `0x${string}`);
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Wait for transaction receipt and handle replacement scenarios
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    onReplaced: replacement => {
      if (replacement.reason === "repriced") {
        setIsReplaced(true);
        setNewHash(replacement.transactionReceipt.transactionHash);
        localStorage.setItem("isReplaced", "true");
        localStorage.setItem("newHash", replacement.transactionReceipt.transactionHash);
        const event = new CustomEvent('transactionReplaced', {
          detail: {
            newHash: replacement.transactionReceipt.transactionHash,
            isReplaced: true
          }
        });
        window.dispatchEvent(event);
      }
    }
  });

  // Effect to handle storage changes for replacement status and new hash
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isReplaced") {
        setIsReplaced(e.newValue === "true");
      }
      if (e.key === "newHash") {
        setNewHash(e.newValue || "");
      }
    };
    
    const handleTransactionReplaced = (e: CustomEvent<{ newHash: string; isReplaced: boolean }>) => {
      setIsReplaced(e.detail.isReplaced);
      setNewHash(e.detail.newHash);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('transactionReplaced', handleTransactionReplaced as EventListener);
    
    const storedIsReplaced = localStorage.getItem("isReplaced");
    const storedNewHash = localStorage.getItem("newHash");
    
    if (storedIsReplaced) setIsReplaced(storedIsReplaced === "true");
    if (storedNewHash) setNewHash(storedNewHash);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('transactionReplaced', handleTransactionReplaced as EventListener);
    };
  }, []);

  // Effect to update local pending state based on contract write status
  useEffect(() => {
    setLocalIsPending(isPending);
  }, [isPending]);

  // Effect to handle custom pending state changes
  useEffect(() => {
    const handlePendingStateChange = (event: CustomEvent<{ isPending: boolean }>) => {
      setLocalIsPending(event.detail.isPending);
    };

    window.addEventListener('pendingStateChange', handlePendingStateChange as EventListener);
    return () => {
      window.removeEventListener('pendingStateChange', handlePendingStateChange as EventListener);
    };
  }, []);

  // Custom hook to manage transaction state
  useTransactionState(
    isConfirming,
    isConfirmed,
    error,
    setTokenAddress,
    setRecipient,
    setAmount,
    setIsTokenAddressVerified,
    localIsPending
  );

  // Function to check the validity of the token address
  async function checkTokenValidity(tokenAddress: string) {
    try {
      if (!tokenAddress) {
        const errorMessage = "Please enter a token address";
        localStorage.setItem("toastType", "error");
        localStorage.setItem("toastMessage", errorMessage);
        toast.error(errorMessage);
        setIsTokenAddressVerified(false);
        return;
      }

      const formattedAddress = getAddress(tokenAddress);
      setTokenAddress(formattedAddress);
      setIsTokenAddressVerified(true);
      localStorage.setItem("isTokenAddressVerified", "true");
      const successMessage = "Token address verified";
      localStorage.setItem("toastType", "success");
      localStorage.setItem("toastMessage", successMessage);
      toast.success(successMessage);
      
    } catch (error) {
      setIsTokenAddressVerified(false);
      const errorMessage = "Invalid token address format";
      localStorage.setItem("toastType", "error");
      localStorage.setItem("toastMessage", errorMessage);
      toast.error(errorMessage);
    }
  }

  // Function to handle form submission for the transaction
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem("tokenAddress", tokenAddress);
    localStorage.setItem("recipient", recipient);
    localStorage.setItem("amount", amount);

    const amountInSmallestUnit = BigInt(Math.floor(parseFloat(amount) * (10 ** decimal)));

    writeContract({
      address: getAddress(tokenAddress),
      abi,
      functionName: "transfer",
      args: [getAddress(recipient), amountInSmallestUnit],
    });

    const message = "Waiting for confirmation...";
    localStorage.setItem("toastType", "info");
    localStorage.setItem("toastMessage", message);
    toast.info(message);
  }

  return (
    <>
      <div className="top-0">
        <ToastContainer />
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <TokenAddressInput 
            tokenAddress={tokenAddress}
            setTokenAddress={setTokenAddress}
            checkTokenValidity={checkTokenValidity}
            isTokenAddressVerified={isTokenAddressVerified}
            setIsTokenAddressVerified={setIsTokenAddressVerified}
          />

          <TransferForm 
            isTokenAddressVerified={isTokenAddressVerified}
            recipient={recipient}
            setRecipient={setRecipient}
            amount={amount}
            setAmount={setAmount}
            walletBalance={walletBalance}
            decimal={decimal}
            isPending={localIsPending}
            onSubmit={submit}
          />

          <TransactionHashDisplay 
            hash={(hash || displayHash) as `0x${string}`} 
            isReplaced={isReplaced} 
            newHash={newHash as `0x${string}`} 
          />
        </div>
      </div>
    </>
  );
}
