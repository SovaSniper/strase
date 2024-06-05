import { GetContractReturnType, PublicClient, WalletClient, getContract, toHex } from "viem";
import { DEFAULT_NETWORK } from "./constants";
import { getClient } from "./client";
import { abi } from "../abi/consumer";
import { encodeFunctionData } from 'viem'
// import fs from 'fs';
// import path from "path";

export const address = "0x14b9602F6Bdf92B0D268Fe6524E479742D96FeD9" as `0x${string}`

const callbackGasLimit = 300_000;
export class PayNownConsumer {
    contract: any;
    publicWallet: PublicClient;
    subscriptionId: string = "60";

    constructor(chain: string = DEFAULT_NETWORK, wallet: WalletClient) {
        this.publicWallet = getClient(chain);

        console.log("Creating contract instance", address, chain, wallet);
        this.contract = getContract({
            address,
            abi,
            client: { public: this.publicWallet, wallet: wallet },
        })
    }

    /**
     * 
     * @param publishableKey 
     * @param paymentIntent 
     * @returns 
     */
    async sendRequest(publishableKey: string, paymentIntent: string) {
        const args = [toHex(publishableKey), toHex(paymentIntent)];
        const response = await fetch("/api/source");
        const source = await response.text();

        console.log("Sending request to Chainlink node", args);
        return await this.contract.write.sendRequest([
            source, // source
            "0x", // user hosted secrets - encryptedSecretsUrls - empFty in this example
            0, // don hosted secrets - slot ID - empty in this example
            0, // don hosted secrets - version - empty in this example
            args,
            [], // bytesArgs - arguments can be encoded off-chain to bytes.
            this.subscriptionId,
            callbackGasLimit,
        ]);
    }

    sendRequestData(publishableKey: string, paymentIntent: string) {
        const args = [toHex(publishableKey), toHex(paymentIntent)];
        // const source = fs
        //     .readFileSync(path.resolve('./public', "source.js"))
        //     .toString();
        const source = "$%435345"

        console.log("Sending request to Chainlink node", source);

        const data = encodeFunctionData({
            abi: abi,
            functionName: 'sendRequest',
            args: [
                source, // source
                "0x", // user hosted secrets - encryptedSecretsUrls - empFty in this example
                0, // don hosted secrets - slot ID - empty in this example
                0, // don hosted secrets - version - empty in this example
                args,
                [], // bytesArgs - arguments can be encoded off-chain to bytes.
                this.subscriptionId,
                callbackGasLimit,
            ]
        })

        return data;
    }
}
