export enum ChainID {
    BASE_MAINNET = "8453",
    BASE_SEPOLIA = "84532",
}

const rpc: { [key: string]: string } = {
    [ChainID.BASE_MAINNET]: "https://1rpc.io/base",
    [ChainID.BASE_SEPOLIA]: "https://base-sepolia-rpc.publicnode.com",
}

export const getRPC = (chain: string = ChainID.BASE_MAINNET) => rpc[chain];