"use client"

import { cn } from "@/lib/utils"
import { CodeBlock } from "../shared/code-block"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type CarouselApi } from "@/components/ui/carousel"
import { useState, useEffect } from "react"

interface DeveloperExperienceProps extends React.HTMLAttributes<HTMLDivElement> {
}

const client = {
    title: 'client.ts',
    code: `
import { createWalletClient, custom } from "viem"
import { base } from "viem/chains"

// Metamask or
export const walletClient = createWalletClient({
    chain: base,
    transport: custom(window.ethereum!),
})

// Other provider Coinbase Wallet
// const provider = await getProvider();
export const walletClientWC = createWalletClient({
    chain: base,
    transport: custom(provider),
})
    `,
}

const viem = {
    title: 'main.ts',
    code: `
import { FunctionConsumer } from "strase";
import { base } from "viem/chains";
import { walletClient } from "./client";

export const main = async (
    publishableKey: string, 
    clientSecret: string
) => {
    const consumer = new FunctionConsumer(
        base.id.toString(), 
        walletClient);
    const hash = await consumer.sendRequest(publishableKey, 
        clientSectret);

    console.log("tx hash", hash)
}
    `,
}

const smartWallet = {
    title: 'main.ts',
    code: `
import { FunctionConsumer } from "strase";
import { sendTransaction } from '@wagmi/core'
import { config } from "./config";
import { walletClient } from "./client";

export const main = async (
    publishableKey: string, 
    clientSecret: string
) => {
     const consumer = new FunctionConsumer(
        base.id.toString(), 
        walletClient);
    const data = consumer.sendRequestEncode(publishableKey, 
        clientSectret);

    const result = await sendTransaction(config, {
        to: getConsumerAddress(DEFAULT_NETWORK),
        data,
    })
}
    `,
}

const config = {
    title: 'config.ts',
    code: `
import { base, baseSepolia } from "wagmi/chains";
import { createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

// Wagmi config, typically in used in providers
export const config = createConfig({
    chains: [base],
    connectors: [
        coinbaseWallet({
            appChainIds: [base.id],
            appName: 'onchainkit',
        }),
    ],
    ssr: true,
    transports: {
        [base.id]: http(),
    },
});
    `,
}

const privy = {
    title: 'main.ts',
    code: `
import { ChainID, FunctionConsumer, getConsumerAddress } from "strase";
import { walletClient } from "./client";
import { SendTransactionModalUIOptions, UnsignedTransactionRequest, usePrivy } from "@privy-io/react-auth";

const { sendTransaction } = usePrivy();

export const main = async (
    publishableKey: string, 
    clientSecret: string
) => {
     const consumer = new FunctionConsumer(
        ChainID.BASE_MAINNET, 
        walletClient);
    const data = consumer.sendRequestEncode(publishableKey, 
        clientSectret);

    const requestData: UnsignedTransactionRequest = {
    to: getConsumerAddress(ChainID.BASE_MAINNET),
        chainId: parseInt(ChainID.BASE_MAINNET),
        data,
        gasLimit: 3_000_000,
    };

    const uiConfig: SendTransactionModalUIOptions = {
        header: 'Strase Reward',
        description: 'Congratulations ...',
        buttonText: 'Earn Reward',
    };

    const txReceipt = await sendTransaction(requestData, uiConfig);
    console.log(txReceipt);
}
        `
}
const soon = {
    title: 'main.ts',
    code: `
// Coming Soon
    `,
}

const items = [
    {
        title: 'Viem',
        description: 'Integrate with Python',
        content: [viem, client]
    },
    {
        title: 'Coinbase Smart Wallet',
        description: 'Integrate with Python',
        content: [smartWallet, config, client]
    },
    {
        title: 'Wagmi',
        description: 'Integrate with Python',
        content: [smartWallet, config, client]
    },
    {
        title: 'Privy',
        description: 'Integrate with Python',
        content: [privy, client]
    },
    {
        title: 'Python',
        description: 'Integrate with Python',
        content: [soon]
    },
    {
        title: '.NET',
        description: 'Integrate with Python',
        content: [soon]
    },
]

export const DeveloperExperience = ({
    className
}: DeveloperExperienceProps) => {
    const [api, setApi] = useState<CarouselApi>()
    const [selectedItem, setSelectedItem] = useState(items[0])

    useEffect(() => {
        if (!api) {
            return
        }

        api.on("select", (emblaApi) => {
            setSelectedItem(items[emblaApi.selectedScrollSnap()])
        })

    }, [api])

    return <div id="devexp" className="container">
        <div className="text-2xl sm:text-4xl font-medium mb-4 max-w-[651px] mx-auto text-center">
            Simple Integration with Stripe with any Web3 libraries and Wallets
        </div>
        <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-6">
                <Carousel opts={{ align: "start", loop: true, }} setApi={setApi}
                    className="w-[80%] left-1/2 -translate-x-1/2 my-2 sm:my-[3rem]">
                    <CarouselContent>
                        {items.map((item) => (
                            <CarouselItem key={item.title} >
                                <div className="bg-secondary text-white rounded-md p-6 flex items-center h-max">
                                    <div>
                                        <div className="text-2xl font-semibold">{item.title}</div>
                                        <div className="text-sm text-foreground/60">{item.description}</div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-white" />
                    <CarouselNext className="bg-white" />
                </Carousel>
            </div>
            <div className="col-span-12 lg:col-span-6 container">
                {selectedItem.content &&
                    <Tabs defaultValue={selectedItem.content[0].title}>
                        <TabsList>
                            {selectedItem.content.map((code) => {
                                return <TabsTrigger key={code.title} value={code.title}>{code.title}</TabsTrigger>

                            })}
                        </TabsList>

                        {selectedItem.content.map((code) => {
                            return <TabsContent key={code.title} value={code.title} className="h-[50vh] overflow-y-auto">
                                <CodeBlock code={code.code.trim()} />
                            </TabsContent>
                        })}
                    </Tabs>}
            </div>
        </div>
    </div>
}