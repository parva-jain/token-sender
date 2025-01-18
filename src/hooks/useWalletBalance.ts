import { useEffect, useState } from 'react';
import { useBalance, useAccount } from 'wagmi';

export function useWalletBalance(tokenAddress: string, isTokenAddressVerified: boolean) {
  // fetching current account info and token balance
  const account = useAccount();
  const { data: balance } = useBalance({ 
    address: account.address,
    token: isTokenAddressVerified ? tokenAddress as `0x${string}` : undefined
  });
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [decimal, setDecimal] = useState<number>(0);
  

  function convertBalanceToNormal(balance: {
    decimals: number;
    formatted: string;
    symbol: string;
    value: bigint;
  }) {
    const { value, decimals } = balance;
    const valueString = value.toString();
    const divisor = 10 ** decimals;
    return Number((Number(valueString) / divisor).toFixed(5));
  }

  // Effect to update wallet balance and decimal when balance is fetched
  useEffect(() => {
    if (balance && isTokenAddressVerified) {
      setWalletBalance(convertBalanceToNormal(balance));
      setDecimal(balance.decimals);
    } else {
      setWalletBalance(0);
    }
  }, [balance, account, isTokenAddressVerified]);

  // return wallet balance and decimal
  return { walletBalance, decimal };
} 