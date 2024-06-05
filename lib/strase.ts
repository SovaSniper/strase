import { createWalletClient, custom } from "viem";
import { ConnectedWallet } from "@privy-io/react-auth";
import { base, baseSepolia } from "viem/chains";
import { ChainID } from "strase";

export const DEFAULT_NETWORK = ChainID.BASE_SEPOLIA;

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