import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SK || "");

export async function POST(request: NextRequest) {
    const { amount, currency } = await request.json();
    console.log("amount", amount, "currency", currency)
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        // payment_method_types: ['card'],
        automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
    })
}