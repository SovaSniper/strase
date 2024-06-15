"use client"

import { useStrase } from "../connector-provider"
import { Redeem as RedeemPrivy } from "./privy/redeem"
import { Redeem as RedeemSmartWallet } from "./smart-wallet/redeem"

interface RenderRedeemListProps extends React.HTMLAttributes<HTMLDivElement> { }

export const RenderRedeemList = ({ }: RenderRedeemListProps) => {
    const { walletOption } = useStrase()

    return <>
        {walletOption === "smart-wallet" ? <RedeemSmartWallet /> : <RedeemPrivy />}
    </>
}