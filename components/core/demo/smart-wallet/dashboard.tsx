"use client"

import { useStrase } from "../../connector-provider";
import { SendTransactionModalUIOptions, UnsignedTransactionRequest, usePrivy, useWallets } from "@privy-io/react-auth";
import { DEFAULT_NETWORK, getWalletClient } from "@/lib/strase";
import {
    FunctionConsumer,
    getConsumerAddress
} from "strase";
import { DemoDashboard, getPublishableKey } from "@/components/core/demo-dashboard";
import { useWriteContract } from "wagmi";
import { sendTransaction } from '@wagmi/core'
import { config } from "@/components/providers";

interface DashboardProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const Dashboard = ({ }: DashboardProps) => {
    const { wallets } = useWallets();
    const { writeContract } = useWriteContract();

    const handleStraseIntegration = async (clientSectret: string) => {
        // Strase Integration with Privy
        const publishableKey = await getPublishableKey();
        const wallet: any = await getWalletClient(DEFAULT_NETWORK, wallets[0]);
        const consumer = new FunctionConsumer({
            chain: DEFAULT_NETWORK,
            wallet: wallet,
        });
        const data = consumer.sendRequestEncode(publishableKey, clientSectret);
        console.log(data)

        console.log('writeContract', config)
        const result = await sendTransaction(config, {
            to: getConsumerAddress(DEFAULT_NETWORK) as `0x${string}`,
            // chainId: parseInt(DEFAULT_NETWORK),
            data: data,
            // gasLimit: 3_000_000,
        })

        console.log(result)
    }

    return <DemoDashboard handleStraseIntegration={handleStraseIntegration} />
}