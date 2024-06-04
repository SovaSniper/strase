"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fromHex, toHex } from 'viem'

interface EncryptToolProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const EncryptTool = ({ }: EncryptToolProps) => {
    const [data, setData] = useState<string>("")
    const [byteData, setByteData] = useState<string>("")

    function hexStringToBytes(hex: string): Uint8Array {
        // Remove optional "0x" prefix
        if (hex.startsWith('0x')) {
            hex = hex.slice(2);
        }

        // Ensure the hex string has an even length
        if (hex.length % 2 !== 0) {
            throw new Error('Hex string must have an even length');
        }

        const byteArray = new Uint8Array(hex.length / 2);

        for (let i = 0; i < hex.length; i += 2) {
            byteArray[i / 2] = parseInt(hex.substr(i, 2), 16);
        }

        return byteArray;
    }

    const handleEncryption = async () => {
        setByteData(toHex(data))
    }

    const handleDecryption = async () => {
        console.log(data)
        if (!data.startsWith("0x")) {
            console.error("Invalid hex string")
            setByteData("Invalid hex string")
            return;
        }

        setByteData(fromHex(data as `0x${string}`, "string"))
    }

    return <div>
        <Input type="Data" placeholder="Enter your input"
            value={data}
            onChange={(e) => setData(e.target.value)} />
        <div>
            Data: {byteData && <div>{byteData}</div>}
        </div>
        <Button onClick={handleEncryption} id="submit">
            Encrypt
        </Button>

        <Button onClick={handleDecryption} id="submit">
            Decrypt
        </Button>
    </div>
}