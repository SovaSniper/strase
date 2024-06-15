"use client"

import { DEFAULT_NETWORK } from "@/lib/strase";
import {
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
        // Strase Integration with Privy
        const publishableKey = await getPublishableKey();
        const consumer = new FunctionConsumer({ chain: DEFAULT_NETWORK, });
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