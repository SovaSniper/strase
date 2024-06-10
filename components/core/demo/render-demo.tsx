"use client"

import { useStrase } from "../connector-provider"
import { Dashboard as DashboardPrivy } from "./privy/dashboard"
import { Dashboard as DashboardSmartWallet } from "./smart-wallet/dashboard"

interface RenderDemoDashboardProps extends React.HTMLAttributes<HTMLDivElement> { }

export const navItems = [
    {
        title: 'Demo',
        href: '/demo',
    },
    {
        title: 'Redeem',
        href: '/redeem',
    },
]

export const RenderDemoDashboard = ({ }: RenderDemoDashboardProps) => {
    const { walletOption } = useStrase()

    return <>
        {walletOption === "smart-wallet" ? <DashboardSmartWallet /> : <DashboardPrivy />}
    </>
}