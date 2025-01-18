import { http, createStorage } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  chains: [sepolia],
  storage: createStorage({
        storage: localStorage,
        key: 'wagmi',
      }),
  transports: {
        [sepolia.id]: http(),
    },
});