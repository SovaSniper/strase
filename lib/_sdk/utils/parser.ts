
import { getContract } from "viem";
import { getClient } from "./client";
import { abi } from "../abi/parser";
import { DEFAULT_NETWORK } from "./constants";

export const address = "0x14b9602F6Bdf92B0D268Fe6524E479742D96FeD9" as `0x${string}`

export class ParserContract {
    contract: any;
    client: any;

    constructor(chain: string = DEFAULT_NETWORK) {
        this.client = getClient(chain);
        this.contract = getContract({
            address,
            abi,
            client: this.client,
        })
    }

    async pack(amount: BigInt, status: BigInt): Promise<BigInt> {
        return this.contract.read.pack([amount, status])
    }

    async parse(data: string): Promise<PaymentData> {
        return this.contract.read.parse([data]) as PaymentData
    }

    async parseAsString(data: string): Promise<PaymentData> {
        return this.contract.read.parseAsString([data]) as PaymentData
    }
}

interface PaymentData {
    amount: BigInt;
    status: BigInt;
}