"use client"

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ConnectWallet } from "../connect-wallet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Identicon } from "./identicon";
import { Profile } from "./profile";

interface NavBarProps extends React.HTMLAttributes<HTMLDivElement> { }

const navItems = [
    {
        title: 'Demo',
        href: '/demo',
    },
    {
        title: 'Redeem',
        href: '/redeem',
    },
]

export const NavBar = ({ }: NavBarProps) => {
    const router = useRouter();
    const {
        ready,
        authenticated,
        user,
        exportWallet,
        logout,
    } = usePrivy();

    const isAuthenticated = ready && authenticated;

    const hasEmbeddedWallet = !!user?.linkedAccounts.find(
        (account) => account.type === 'wallet' && account.walletClient === 'privy',
    );

    useEffect(() => {
        if (!ready) {
            return;
        }

        // if (!authenticated) {
        //     router.push('/login');
        // }

        console.log('user', user);
    }, [ready, authenticated]);

    return <header className={cn("sticky top-0 z-40 border-b border-transparent group bg-white/20 backdrop-blur is-active border-zinc-950/10")}>
        <div className="flex h-16 items-center justify-between py-6 container">
            <div className="flex gap-6 md:gap-10">
                <div className="text-3xl font-semibold tracking-tight">Strase</div>
                {navItems.map((item) => (
                    <div key={item.title} className={cn("flex items-center text-lg font-medium cursor-pointer transition-colors hover:text-foreground/80 sm:text-sm text-foreground/60")}
                        onClick={() => router.push(item.href)}>
                        {item.title}
                    </div>))}
            </div>

            <div>
                {user?.id
                    ? <Profile />
                    : <ConnectWallet />}
            </div>
        </div>
    </header>
}