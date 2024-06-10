"use client"

import { useStrase } from "../connector-provider"
import { NavBar as NavBarPrivy } from "./privy/navbar"
import { NavBar as NavBarSmartWallet } from "./smart-wallet/navbar"

interface RenderNavBarProps extends React.HTMLAttributes<HTMLDivElement> { }

export const RenderNavBar = ({ }: RenderNavBarProps) => {
    const { walletOption } = useStrase()

    return <>
        {walletOption === "smart-wallet" ? <NavBarSmartWallet /> : <NavBarPrivy />}
    </>
}