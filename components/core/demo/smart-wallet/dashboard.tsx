"use client"

import { DEFAULT_NETWORK } from "@/lib/strase";
import {
    ChainID,
    FunctionConsumer,
    getConsumerAddress
} from "strase";
import { DemoDashboard, getPublishableKey } from "@/components/core/demo-dashboard";
import { sendTransaction } from '@wagmi/core'
import { config } from "@/components/providers";

interface DashboardProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const Dashboard = ({ }: DashboardProps) => {
    const handleStraseIntegration = async (clientSectret: string) => {
        // Strase Integration with Smart Wallet
        const publishableKey = await getPublishableKey();
        const consumer = new FunctionConsumer({ 
            chain: ChainID.BASE_SEPOLIA, });
        const data = consumer.sendRequestEncode(publishableKey, clientSectret);
        const result = await sendTransaction(config, {
            to: getConsumerAddress(ChainID.BASE_SEPOLIA) as `0x${string}`,
            data: data,
        })

        console.log(result)
    }

    return <DemoDashboard handleStraseIntegration={handleStraseIntegration} />
}