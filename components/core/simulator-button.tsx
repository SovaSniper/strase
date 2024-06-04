"use client"

import { ParserContract } from "@/lib/sdk";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { toHex } from "viem";

interface SimulatorProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const Simulator = ({ }: SimulatorProps) => {
    const [publicKey, setPublicKey] = useState<string>("")
    const [paymentIntent, setPaymentIntent] = useState<string>("")
    const [parser, setParser] = useState<ParserContract>(new ParserContract())

    const handleSimulation = async () => {
        const response = await fetch('/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                publishableKey: toHex(publicKey),
                paymentIntent: toHex(paymentIntent)
            })
        })

        const data = await response.json();
        console.log(data.payload);

        const paymentData = await parser.parse(data.payload)
        console.log("paymentData", paymentData)
    }


    return <div>
        <Input type="public Key" placeholder="Enter your input"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)} />
        <Input type="Payment Intent" placeholder="Enter your input"
            value={paymentIntent}
            onChange={(e) => setPaymentIntent(e.target.value)} />

        <Button onClick={handleSimulation}>
            Test
        </Button>
    </div>
}