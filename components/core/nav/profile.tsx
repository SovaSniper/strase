
"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Identicon } from "./identicon";
import { Copy, FileKey, Keyboard, LogOut, User } from "lucide-react";
import { DEFAULT_NETWORK, getClient } from "@/lib/strase";
import { PublicClient, formatEther } from "viem";
import { ChainID, StraseBuck } from "strase";

interface ProfileProps extends React.HTMLAttributes<HTMLImageElement> {
}

export const Profile = ({ ...props }: ProfileProps) => {
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

    const [client, setClient] = useState<PublicClient>({} as PublicClient);
    const [nativeBalance, setNativeBalance] = useState<bigint>(BigInt(0));
    const [straseBalance, setStraseBalance] = useState<bigint>(BigInt(0));

    useEffect(() => {
        if (!ready) {
            return;
        }

        (async () => {
            const client = await getClient()
            setClient(client)

            const balance = await client.getBalance({
                address: user?.wallet?.address as `0x${string}`,
            })
            console.log('balance', balance)
            setNativeBalance(balance)

            const token = new StraseBuck(DEFAULT_NETWORK, {} as any);

            const bucks = await token.balanceOf(user?.wallet?.address || "")
            console.log('bucks', bucks)
            setStraseBalance(bucks)
        })()
    }, [ready, authenticated]);

    return <DropdownMenu>
        <DropdownMenuTrigger>
            <div className="flex items-center space-x-4">
                <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    {hasEmbeddedWallet && user?.wallet &&
                        <Identicon address={user.wallet?.address as `0x${string}`} />}
                </span>
                <div>
                    <p className="text-sm font-medium leading-none">{formatEther(nativeBalance)} ETH</p>
                    <p className="text-sm font-medium leading-none">{formatEther(straseBalance)} SB</p>
                </div>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(user?.wallet?.address || "") }}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Address</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportWallet} disabled={!isAuthenticated || !hasEmbeddedWallet}>
                    <FileKey className="mr-2 h-4 w-4" />
                    <span>Export Wallet</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Keyboard className="mr-2 h-4 w-4" />
                    <span>Keyboard shortcuts</span>
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}