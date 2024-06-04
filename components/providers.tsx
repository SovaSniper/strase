"use client"

import { getRPC } from "@/lib/sdk/utils/evm";
import { PrivyProvider } from "@privy-io/react-auth";
import { addRpcUrlOverrideToChain } from '@privy-io/react-auth';
import { base, baseSepolia } from 'viem/chains';

const mainnetOverride = addRpcUrlOverrideToChain(base, getRPC(base.id.toString()));
const testnetOverride = addRpcUrlOverrideToChain(baseSepolia, getRPC(baseSepolia.id.toString()));

export const Providers = ({ children }: any) => {
    return <PrivyProvider
        appId='clwv97bmu07rfa8vug5z636d3'
        config={{
            embeddedWallets: {
                createOnLogin: 'users-without-wallets'
            },
            loginMethods: ['email', 'wallet', 'google', 'discord', 'twitter', 'github'],
            supportedChains: [mainnetOverride, testnetOverride],
        }}>
        {children}
    </PrivyProvider>
}
