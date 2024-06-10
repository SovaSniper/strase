"use client"

import { PrivyProvider } from "@privy-io/react-auth";
import { addRpcUrlOverrideToChain } from '@privy-io/react-auth';
import { getRPC } from "strase";
import { base, baseSepolia } from 'viem/chains';
import { http, createConfig } from 'wagmi'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { coinbaseWallet } from 'wagmi/connectors';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { StraseProvider } from "./core/connector-provider";

export const config = createConfig({
    chains: [baseSepolia],
    connectors: [
        coinbaseWallet({
            // //ts-ignore
            // appChainIds: [baseSepolia.id],
            appName: 'onchainkit',
        }),
    ],
    ssr: true,
    transports: {
        [baseSepolia.id]: http(),
    },
});
const queryClient = new QueryClient()

const mainnetOverride = addRpcUrlOverrideToChain(base, getRPC(base.id.toString()) || "");
const testnetOverride = addRpcUrlOverrideToChain(baseSepolia, getRPC(baseSepolia.id.toString()) || "");

export const Providers = ({ children }: any) => {
    return <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <OnchainKitProvider chain={baseSepolia}>
                <PrivyProvider
                    appId='clwv97bmu07rfa8vug5z636d3'
                    config={{
                        embeddedWallets: {
                            createOnLogin: 'users-without-wallets'
                        },
                        loginMethods: ['email', 'wallet', 'google', 'discord', 'twitter', 'github'],
                        supportedChains: [mainnetOverride, testnetOverride],
                    }}>
                    <StraseProvider>
                        {children}
                    </StraseProvider>
                </PrivyProvider>
            </OnchainKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
}
