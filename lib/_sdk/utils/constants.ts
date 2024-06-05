import { ChainID } from "./evm"

export const DEFAULT_NETWORK = ChainID.BASE_SEPOLIA;

export const constants: Constants = {
    development: {
        tokenAddress: "0x7A9CdE86c3Cbf1251a717FEAF191AE63adc573E9",
        functionConsumer: "0x59422Eeb47bAD4147F46a378e68c0B32D62B135B",
    },
    production: {
        tokenAddress: "0x7A9CdE86c3Cbf1251a717FEAF191AE63adc573E9",
        functionConsumer: "0x59422Eeb47bAD4147F46a378e68c0B32D62B135B",
    }
}

export const getPayNounContractAddress = (development: boolean = false) => {
    const network = development ? "development" : "production";
    return constants[network].functionConsumer || "";
}

interface Constants {
    development: ConstantData,
    production: ConstantData,
}

interface ConstantData {
    tokenAddress: `0x${string}`,
    functionConsumer: `0x${string}`,
}