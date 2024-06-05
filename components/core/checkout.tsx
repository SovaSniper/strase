import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { SendTransactionModalUIOptions, UnsignedTransactionRequest, usePrivy, useWallets } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";
import { createWalletClient, custom } from "viem";

// import { getWalletClient } from "@/lib/sdk/utils/client";
// import { ChainID } from "@/lib/sdk/utils/evm";
// import { PayNownConsumer } from "@/lib/sdk/utils/consumer";
// import { getPayNounContractAddress } from "@/lib/sdk";

import { getWalletClient } from "@/lib/strase";
import {
    ChainID,
    PayNownConsumer,
    getPayNounContractAddress
} from "strase";

export default function CheckoutForm() {
    const { sendTransaction } = usePrivy();
    const stripe = useStripe();
    const elements = useElements();
    const { wallets } = useWallets();

    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required"
        });

        if (error) {
            setMessage(error.message || "An unknown error occurred");
        }

        console.log(paymentIntent);
        setClientSecret(paymentIntent?.client_secret || "");

        // !IMPORTANT: Pay Noun Integration
        const wallet = await getWalletClient(ChainID.BASE_SEPOLIA, wallets[0]);

        const consumer = new PayNownConsumer(ChainID.BASE_SEPOLIA, wallet);
        // const reciept = await consumer.sendRequest("wallet", "testing");
        // console.log(reciept);

        const data = consumer.sendRequestData("wallet", "testing");
        const requestData: UnsignedTransactionRequest = {
            to: getPayNounContractAddress(true),
            chainId: parseInt(ChainID.BASE_SEPOLIA),
            // data: data,
            // value: '0x3B9ACA00',
        };

        const uiConfig: SendTransactionModalUIOptions = {
            header: 'Pay Noun Earn Reward',
            description: 'Congratulations! You have successfully paid for the product. Now, you can earn reward by clicking the button below.',
            buttonText: 'Earn Reward',
            transactionInfo: {
                contractInfo: {
                    name: "Pay Noun",
                    url: "https://paynoun.com",
                }
            }
        };
        const txReceipt = await sendTransaction(requestData, uiConfig);
        console.log(txReceipt);

        setIsProcessing(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <Button disabled={isProcessing || !stripe || !elements} id="submit" className="w-full mt-2">
                <span id="button-text">
                    {isProcessing ? "Processing ... " : "Pay now"}
                </span>
            </Button>
            {clientSecret && <div>
                Receipt: {clientSecret}
            </div>}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}