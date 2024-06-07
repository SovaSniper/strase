import { NextRequest, NextResponse } from "next/server";
import { fromHex } from "viem";
import { validStraseWithStripe } from "@/lib/functions";

const testnet = true;
export async function POST(request: NextRequest) {
    const body = await request.json()
    const publishableKey: string = fromHex(body.publishableKey || "0x" as `0x${string}`, "string")
    const paymentIntent: string = fromHex(body.paymentIntent || "0x" as `0x${string}`, "string")

    try {
        const ret = await validStraseWithStripe(publishableKey, paymentIntent, testnet);
        return NextResponse.json(ret)
    } catch (e: any) {
        console.log(e);
        return NextResponse.json({ message: e.message }, { status: 400 })
    }
}