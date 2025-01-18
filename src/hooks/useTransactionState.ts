import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { BaseError } from 'wagmi';

export function useTransactionState(
  isConfirming: boolean,
  isConfirmed: boolean,
  error: Error | null,
  setTokenAddress: (value: string) => void,
  setRecipient: (value: string) => void,
  setAmount: (value: string) => void,
  setIsTokenAddressVerified: (value: boolean) => void,
  isPending: boolean
) {
  // Effect to store isPending state in localStorage
  useEffect(() => {
    localStorage.setItem("isPending", isPending.toString());

    const savedTokenAddress = localStorage.getItem("tokenAddress");
    const savedRecipient = localStorage.getItem("recipient");
    const savedAmount = localStorage.getItem("amount");

    if (savedTokenAddress) setTokenAddress(savedTokenAddress);
    if (savedRecipient) setRecipient(savedRecipient);
    if (savedAmount) setAmount(savedAmount);

    // Listen for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "tokenAddress") {
        setTokenAddress(event.newValue || "");
      } else if (event.key === "recipient") {
        setRecipient(event.newValue || "");
      } else if (event.key === "amount") {
        setAmount(event.newValue || "");
      } else if (event.key === "isTokenAddressVerified") {
        setIsTokenAddressVerified(event.newValue === "true");
      } else if (event.key === "isReplaced") {
        window.dispatchEvent(new CustomEvent('replacedStateChange', {
          detail: { isReplaced: event.newValue === "true" }
        }));
      } else if (event.key === "newHash") {
        window.dispatchEvent(new CustomEvent('newHashChange', {
          detail: { newHash: event.newValue || "" }
        }));
      } else if (event.key === "toastMessage" && event.newValue) {
        const toastType = localStorage.getItem("toastType");
        switch (toastType) {
          case "success":
            toast.success(event.newValue);
            break;
          case "error":
            toast.error(event.newValue);
            break;
          case "info":
            toast.info(event.newValue);
            break;
          default:
            toast(event.newValue);
        }
      } else if (event.key === "isPending") {
        window.dispatchEvent(new CustomEvent('pendingStateChange', {
          detail: { isPending: event.newValue === "true" }
        }));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isPending]);

  // Effect to clear states when transaction is confirming
  useEffect(() => {
    if (isConfirming) {
      setTokenAddress("");
      setRecipient("");
      setAmount("");
      setIsTokenAddressVerified(false);
    localStorage.removeItem("isTokenAddressVerified");
    localStorage.removeItem("tokenAddress");
    localStorage.removeItem("recipient");
    localStorage.removeItem("amount");
    localStorage.removeItem("isReplaced");
    localStorage.removeItem("newHash");
  }
}, [isConfirming]);

  // Effect to show notification when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      const message = "Transaction confirmed.";
      localStorage.setItem("toastType", "success");
      localStorage.setItem("toastMessage", message);
      toast.success(message);
    }
  }, [isConfirmed]);

  // Effect to show notification when transaction is failed
  useEffect(() => {
    if (error) {
      const errorMessage = (error as BaseError).shortMessage || error.message;
      toast.dismiss();
      localStorage.setItem("toastType", "error");
      localStorage.setItem("toastMessage", errorMessage);
      toast.error(errorMessage);
      
    }
  }, [error]);
}