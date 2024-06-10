"use client"

import { useStrase } from "../../connector-provider";
import { SendTransactionModalUIOptions, UnsignedTransactionRequest, usePrivy, useWallets } from "@privy-io/react-auth";
import { DEFAULT_NETWORK, getWalletClient } from "@/lib/strase";
import {
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
        const wallet: any = await getWalletClient(DEFAULT_NETWORK, wallets[0]);
        const consumer = new FunctionConsumer({
            chain: DEFAULT_NETWORK,
            wallet: wallet,
        });
        const data = consumer.sendRequestEncode(publishableKey, clientSectret);
        console.log(data)

        // Privy transaction
        const requestData: UnsignedTransactionRequest = {
            to: getConsumerAddress(DEFAULT_NETWORK),
            chainId: parseInt(DEFAULT_NETWORK),
            data: data,
            gasLimit: 3_000_000,
            // gasPrice: 8000000000,
            // value: '0x3B9ACA00',
        };
        console.log(requestData);

        const uiConfig: SendTransactionModalUIOptions = {
            header: 'Strase Earn Reward',
            description: 'Congratulations! You have successfully paid for the product. Now, you can earn reward by clicking the button below.',
            buttonText: 'Earn Reward',
        };
        const txReceipt = await sendTransaction(requestData, uiConfig);
        console.log(txReceipt);
    }

    return <DemoDashboard handleStraseIntegration={handleStraseIntegration} />
}