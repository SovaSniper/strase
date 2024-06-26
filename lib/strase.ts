import { AbiItem, createPublicClient, createWalletClient, custom, http } from "viem";
import { ConnectedWallet } from "@privy-io/react-auth";
import { base, baseSepolia } from "viem/chains";
import { ChainID, getRPC } from "strase";

export const DEFAULT_NETWORK = ChainID.BASE_SEPOLIA;

export const getPriceFeedClient = () => {
    return createPublicClient({
        transport: http("https://polygon-rpc.com/"),
    })
}

export const getClient = (chain: string = DEFAULT_NETWORK) => {
    const rpcUrl = getRPC(chain)
    return createPublicClient({
        transport: http(rpcUrl),
    })
}

export const getWalletClient = async (chain: string = DEFAULT_NETWORK, wallet: ConnectedWallet) => {
    let viemChain: any = baseSepolia;
    if (chain === ChainID.BASE_SEPOLIA) {
        viemChain = base;
    }

    const provider = await wallet.getEthereumProvider();
    return createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: viemChain,
        transport: custom(provider),
    });
}

export interface StraseStore {
    id: string;
    name: string;
    image: string;
    amount: string;
    contract: `0x${string}`;
    abi: {
        inputs: any[];
        name: string;
    };
}