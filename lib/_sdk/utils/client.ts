import { createPublicClient, createWalletClient, custom, http } from "viem"
import { DEFAULT_NETWORK } from "./constants"
import { ChainID, getRPC } from "./evm"
import { ConnectedWallet, useWallets } from "@privy-io/react-auth"
import { base, baseSepolia } from "viem/chains"

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