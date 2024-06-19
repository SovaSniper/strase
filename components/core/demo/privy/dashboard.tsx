"use client"

import { useStrase } from "../../connector-provider";
import { SendTransactionModalUIOptions, UnsignedTransactionRequest, usePrivy, useWallets } from "@privy-io/react-auth";
import { DEFAULT_NETWORK, getWalletClient } from "@/lib/strase";
import {
    ChainID,
    FunctionConsumer,
    getConsumerAddress
} from "strase";
import { DemoDashboard, getPublishableKey } from "@/components/core/demo-dashboard";

interface DashboardProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const Dashboard = ({ }: DashboardProps) => {
    const { wallets } = useWallets();
    const { sendTransaction } = usePrivy();

    const handleStraseIntegration = async (clientSectret: string) => {
        // Strase Integration with Privy
        const publishableKey = await getPublishableKey();
        const wallet: any = await getWalletClient(ChainID.BASE_SEPOLIA, wallets[0]);
        const consumer = new FunctionConsumer({
            chain: ChainID.BASE_SEPOLIA, wallet});
        const data = consumer.sendRequestEncode(publishableKey, clientSectret);

        // Privy transaction
        const requestData: UnsignedTransactionRequest = {
            to: getConsumerAddress(ChainID.BASE_SEPOLIA),
            chainId: parseInt(ChainID.BASE_SEPOLIA),
            data: data,
            gasLimit: 3_000_000,
        };
        const txReceipt = await sendTransaction(requestData, {
            header: 'Strase Earn Reward',
            description: 'Congratulations! You have successfully paid for the product. Now, you can earn reward by clicking the button below.',
            buttonText: 'Earn Reward',
        });
        console.log(txReceipt);
    }

    return <DemoDashboard handleStraseIntegration={handleStraseIntegration} />
}