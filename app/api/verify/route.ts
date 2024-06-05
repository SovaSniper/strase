import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { ParserContract } from "strase";
import { fromHex } from "viem";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const publishableKey: string = fromHex(body.publishableKey || "0x" as `0x${string}`, "string")
    const paymentIntent: string = fromHex(body.paymentIntent || "0x" as `0x${string}`, "string")

    // console.log(publishableKey, paymentIntent)
    if (!publishableKey.startsWith("pk_test_") || !isPaymentIntentValid(paymentIntent))
        return NextResponse.json({ message: "Invalid information" }, { status: 400 })

    const stripe = new Stripe(publishableKey);

    if (!stripe)
        return NextResponse.json({ message: "Failed to load stripe" }, { status: 500 })

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
        return NextResponse.json({
            payload: payload.toString(),
            clientSecret: paymentIntent,
            expired,
            ...payment
        })
    }

    if (!valid) {
        console.log("Payment intent is pending or voided", paymentIntentId, Status.PENDING)
        const payload = await parser.pack(BigInt(0), BigInt(Status.PENDING))

        return NextResponse.json({
            payload: payload.toString(),
            clientSecret: paymentIntent,
            expired,
            ...payment
        })
    }

    const payload = await parser.pack(BigInt(payment.amount), BigInt(Status.PENDING))
    return NextResponse.json({
        payload: payload.toString(),
        clientSecret: paymentIntent,
        expired,
        ...payment
    })
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