import Stripe from "stripe";
import { ParserContract } from "strase";

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

    const expired = isExpired(payment.created)
    const valid = isValid(payment.status)
    const parser = new ParserContract();

    console.log("expired:", expired)
    console.log("valid:", valid)
    console.log("paymentIntent:", payment.amount)

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
            payload: payload.toString(),
            clientSecret: paymentIntent,
            expired,
            ...payment
        }
    }

    const payload = await parser.pack(BigInt(payment.amount), BigInt(Status.PENDING))
    return {
        payload: payload.toString(),
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