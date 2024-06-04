import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json({
        results: [
            {
                name: "USDC",
                image: "/images/usdc.jpeg",
                amount: 10,
                contract: "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d",
                abi: {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "redeem",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
            },
            {
                name: "USDC",
                image: "/images/usdc.jpeg",
                amount: 50,
                contract: "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d",
                abi: {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "redeem",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
            },
            {
                name: "Amazon Gift Card",
                image: "/images/amazon.png",
                amount: 50,
                contract: "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d",
                abi: {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "redeem",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
            },
            {
                name: "Apple Gift Card",
                image: "/images/apple.jpg",
                amount: 50,
                contract: "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d",
                abi: {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "email",
                            "type": "string"
                        }
                    ],
                    "name": "redeem",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
            }
        ]
    })
}