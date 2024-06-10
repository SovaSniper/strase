import Stripe from "stripe";
import { ParserContract } from "strase";
import { getFiatPrice, getSupportedCurrency } from "./price-feed";
import { getPriceFeedClient } from "./strase";
import { getContract } from "viem";
import { abi } from "./utils/price-feed-abi";

export const validStraseWithStripe = async (publishableKey: string, paymentIntent: string, testnet: boolean = false) => {
    // console.log(publishableKey, paymentIntent)
    if (!publishableKey.startsWith(testnet ? "pk_test_" : "pk_") || !isPaymentIntentValid(paymentIntent))
        throw new Error("Invalid information")

    const stripe = new Stripe(publishableKey);

    if (!stripe)
        throw new Error("Failed to load stripe")

    const paymentIntentId = paymentIntent.split('_secret_')[0];
    const payment = await stripe.paymentIntents.retrieve(paymentIntentId, {
        client_secret: paymentIntent
    });

    // Main conversion to SB will be in USD dollars, hence any other currency, will be based of rated conversion
    let value: number = Math.round(payment.amount / 100);
    if (payment.currency !== "usd") {
        const priceFeed = await getFiatPrice(payment.currency)
        if (!priceFeed?.contractAddress) {
            throw new Error("Currency not supported")
        }

        const client = getPriceFeedClient();
        const contract = getContract({ address: priceFeed?.contractAddress, abi, client, })
        const conversion: bigint = await contract.read.latestAnswer() as bigint;

        // Given the conversion rate, convert the amount to USD
        const currencies = await getSupportedCurrency();
        const curr = currencies.find((c) => c.value.toLocaleLowerCase() === payment.currency.toLocaleLowerCase());

        // Transfer to dollar version of the currency, as stripe currently are smallest unit
        let amount = payment.amount;
        if (curr && curr.decimal) {
            amount = payment.amount / (10 ** curr.decimal);
        }
        value = convertCurrencyToUSD(amount, conversion, priceFeed.decimals);
        console.log("Converted value to USD:", payment.currency, value)
    }
    const expired = isExpired(payment.created)
    const valid = isValid(payment.status)
    const parser = new ParserContract();

    console.log("expired:", expired)
    console.log("valid:", valid)
    console.log("paymentIntent:", payment.amount, value)

    if (expired) {
        console.log("Payment intent has expired", paymentIntentId, Status.EXPIRED)
        const payload = await parser.pack(BigInt(0), BigInt(Status.EXPIRED))
        console.log("Payload:", payload.toString())
        return {
            result: payload.toString(),
            clientSecret: paymentIntent,
            expired,
            ...payment
        }
    }

    if (!valid) {
        console.log("Payment intent is pending or voided", paymentIntentId, Status.PENDING)
        const payload = await parser.pack(BigInt(0), BigInt(Status.PENDING))

        return {
            result: payload.toString(),
            clientSecret: paymentIntent,
            expired,
            ...payment
        }
    }

    const payload = await parser.pack(
        BigInt(value), // BigInt(payment.amount), 
        BigInt(Status.PENDING))

    console.log("Payment intent is valid", paymentIntentId, Status.CLAIMED)
    return {
        result: payload.toString(),
        clientSecret: paymentIntent,
        expired,
        ...payment
    }
}

enum Status {
    PENDING,
    EXPIRED,
    CLAIMED,
}

const isPaymentIntentValid = (clientSecret: string): boolean =>
    clientSecret.startsWith("pi_") &&
    clientSecret.includes("_secret_")

const isExpired = (ts: number): boolean => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeDifference = Math.abs(currentTime - ts);
    return timeDifference > 60 * 60;    // 1 hr
}

const isValid = (status: string): boolean => status.toLocaleLowerCase() === "succeeded"

// This should be non cent format
export function convertCurrencyToUSD(amount: number, exchangeRate: bigint, decimals: number): number {
    const exchangeRateFloat = Number(exchangeRate) / Math.pow(10, decimals);
    return Math.round(amount * exchangeRateFloat); // Round to the nearest dollar
}

export function convertUSDToCurrency(amount: number, exchangeRate: bigint, decimals: number): number {
    const exchangeRateFloat = Number(exchangeRate) / Math.pow(10, decimals);
    return Math.round(amount / exchangeRateFloat); // Round to the nearest dollar
}