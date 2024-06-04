"use client"

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ConnectWallet } from "../connect-wallet";
import { Button } from "@/components/ui/button";

interface NavBarProps extends React.HTMLAttributes<HTMLDivElement> { }

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

    return <div>
        {user?.id
            ? <div>
                <Button onClick={logout}>Logout</Button>
                <Button onClick={exportWallet} disabled={!isAuthenticated || !hasEmbeddedWallet}>
                    Export my wallet
                </Button>
            </div> :
            <ConnectWallet />}
    </div>
}