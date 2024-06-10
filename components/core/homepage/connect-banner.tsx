"use client"

import { Button } from "@/components/ui/button";
import { useStrase } from "../connector-provider"

interface ConnectorBannerProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const ConnectorBanner = ({ }: ConnectorBannerProps) => {
    const { walletOption, setWalletOption } = useStrase()

    const handleSwitch = () => {
        setWalletOption(walletOption === "smart-wallet" ? "privy" : "smart-wallet")
    }
    return <div className="bg-secondary text-sm flex items-center justify-center space-x-2">
        <div>
            Currently using {walletOption === "smart-wallet" ? "Coinbase Smart Wallet" : "Privy"}. Switch to
        </div>
        <Button onClick={handleSwitch} size="sm" className="py-1 text-base">
            {walletOption === "smart-wallet" ? "Privy" : "Smart Wallet"}
        </Button>
    </div>
}