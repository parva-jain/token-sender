interface TokenAddressInputProps {
  tokenAddress: string;
  setTokenAddress: (value: string) => void;
  checkTokenValidity: (address: string) => void;
  isTokenAddressVerified: boolean;
  setIsTokenAddressVerified: (value: boolean) => void;
}

export function TokenAddressInput({
  tokenAddress,
  setTokenAddress,
  checkTokenValidity,
  isTokenAddressVerified,
  setIsTokenAddressVerified,
}: TokenAddressInputProps) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex gap-2">
        <input
          name="tokenAddress"
          type="text"
          placeholder="Token Address"
          className="flex-1 p-2.5 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          value={tokenAddress}
          onChange={(e) => {
            setTokenAddress(e.target.value);
            localStorage.setItem("tokenAddress", e.target.value);
            setIsTokenAddressVerified(false);
            localStorage.setItem("isTokenAddressVerified", "false");
          }}
        />
        <button
          type="button"
          onClick={() => {
            checkTokenValidity(tokenAddress);
          }}
          disabled={isTokenAddressVerified}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
        >
          {isTokenAddressVerified ? "Verified" : "Verify"}
        </button>
      </div>
    </div>
  );
}
