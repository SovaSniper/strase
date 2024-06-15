import { DEFAULT_NETWORK, StraseStore } from "@/lib/strase";
import { NextRequest, NextResponse } from "next/server";
import { ChainID, GiftRedeemables, StoreGiftCards, StoreToken } from "strase";
import { formatEther } from "viem";

export async function GET(request: NextRequest) {
    const giftStore = new StoreGiftCards({
        chain: DEFAULT_NETWORK,
    })

    const straseStore: StraseStore[] = []

    const gifts: GiftRedeemables[] = await giftStore.getStore();
    const giftAddress = giftStore.contract.address;
    straseStore.push(...gifts.filter(i => i.active).map((item) => {
        const normalValue = parseInt(formatEther(item.redeemAmount))

        return {
            id: item.id.toString(),
            name: `Amazon $${normalValue} Gift Card`,
            image: "/images/amazon.png",
            amount: item.redeemAmount.toString(),
            contract: giftAddress,
            abi: {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "email",
                        "type": "string"
                    }
                ],
                "name": "redeem",
            },
        }
    }))

    const tokenStore = new StoreToken({
        chain: DEFAULT_NETWORK,
    })

    const tokens = await tokenStore.getStore();
    const tokenAddress = tokenStore.contract.address;
    straseStore.push(...tokens.filter(i => i.active).map((item) => {
        const normalValue = parseInt(formatEther(item.redeemAmount))

        return {
            id: item.id.toString(),
            name: `$${normalValue / 100} USDC`,
            image: "/images/usdc.jpeg",
            amount: item.redeemAmount.toString(),
            contract: tokenAddress,
            abi: {
                "inputs": [],
                "name": "redeem",
            },
        }
    }))

    return NextResponse.json({
        results: straseStore,
    })
}