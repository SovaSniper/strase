import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json({
        publishableKey: process.env.STRIPE_PK || "",
    })
}