import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { SendTransactionModalUIOptions, UnsignedTransactionRequest, usePrivy, useWallets } from "@privy-io/react-auth";

// import { getWalletClient } from "@/lib/sdk/utils/client";
// import { ChainID } from "@/lib/sdk/utils/evm";
// import { PayNownConsumer } from "@/lib/sdk/utils/consumer";
// import { getPayNounContractAddress } from "@/lib/sdk";

import { DEFAULT_NETWORK, getWalletClient } from "@/lib/strase";
import {
    FunctionConsumer,
    getConsumerAddress
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
        try {
            event.preventDefault();
            setIsProcessing(true);
            await trySubmit();
        } catch (error: any) {
            setMessage(error.message || "An unknown error occurred");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    }

    const trySubmit = async () => {
        // Stripe Payment
        const paymentIntent = await confirmStripePayment();
        const paymentIntentClientSecret = paymentIntent.client_secret || "";
        // const paymentIntentClientSecret = "pi_3POtLQRuZyF18QqG1HWHmG2a_secret_vheLIiSMLxVIZY452YYo2d7qu"
        setClientSecret(paymentIntentClientSecret);

        // Strase Integration with Privy
        const publishableKey = await getPublishableKey();
        const wallet: any = await getWalletClient(DEFAULT_NETWORK, wallets[0]);
        const consumer = new FunctionConsumer(DEFAULT_NETWORK, wallet);
        const data = consumer.sendRequestEncode(publishableKey, paymentIntentClientSecret);
        console.log(data)

        // Privy transaction
        const requestData: UnsignedTransactionRequest = {
            to: getConsumerAddress(DEFAULT_NETWORK),
            chainId: parseInt(DEFAULT_NETWORK),
            data: data,
            gasLimit: 2100000,
            // gasPrice: 8000000000,
            // value: '0x3B9ACA00',
        };
        console.log(requestData);

        const uiConfig: SendTransactionModalUIOptions = {
            header: 'Strase Earn Reward',
            description: 'Congratulations! You have successfully paid for the product. Now, you can earn reward by clicking the button below.',
            buttonText: 'Earn Reward',
            // transactionInfo: {
            //     contractInfo: {
            //         name: "Strase",
            //         url: "https://strase-nine.vercel.app/",
            //     }
            // }
        };
        const txReceipt = await sendTransaction(requestData, uiConfig);
        console.log(txReceipt);

        // const provider = await wallets[0].getEthereumProvider();
        // const transactionHash = await provider.request({
        //     method: 'eth_sendTransaction',
        //     params: [requestData],
        // });
    };

    const confirmStripePayment = async () => {
        if (!stripe || !elements) {
            throw new Error("Stripe.js has not loaded yet. Make sure to disable the submit button until Stripe.js has loaded.");
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required"
        });

        if (error) {
            throw new Error(error.message || "An unknown error occurred");
        }

        return paymentIntent;
    }

    const getPublishableKey = async () => {
        const response = await fetch("/api/config", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.publishableKey || "";
    }

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