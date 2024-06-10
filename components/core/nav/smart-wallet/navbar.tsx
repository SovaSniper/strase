"use client"

import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { ConnectAccount } from '@coinbase/onchainkit/wallet';
import { useAccount, useDisconnect } from "wagmi";
import { NavBar as NavBarCommon } from "@/components/core/nav/navbar";
import { useEffect, useState } from 'react';
import { PublicClient, formatEther, isAddress } from 'viem';
import { DEFAULT_NETWORK, getClient } from '@/lib/strase';
import { StraseBuck } from 'strase';
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
import { Copy, FileKey, LogOut, User } from "lucide-react";

interface NavBarProps extends React.HTMLAttributes<HTMLDivElement> { }

export const NavBar = ({ }: NavBarProps) => {
    const { address, status } = useAccount();
    const { disconnect } = useDisconnect();

    const [nativeBalance, setNativeBalance] = useState<bigint>(BigInt(0));
    const [straseBalance, setStraseBalance] = useState<bigint>(BigInt(0));

    useEffect(() => {
        if (address && !isAddress(address || "")) {
            return;
        }

        (async () => {
            const client = await getClient();
            const balance = await client.getBalance({
                address: address as `0x${string}`,
            })
            console.log('balance', balance)
            setNativeBalance(balance)

            const token = new StraseBuck({
                chain: DEFAULT_NETWORK,
            });

            const bucks = await token.balanceOf(address || "")
            console.log('bucks', bucks)
            setStraseBalance(bucks)
        })()
    }, [address]);

    return <NavBarCommon>
        <div>
            {(() => {
                if (status === 'disconnected') {
                    return <ConnectAccount />;
                }

                return (
                    <div className="flex h-8 w-8 items-center justify-center">
                        {address && <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="flex items-center space-x-4">
                                    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                        <Avatar address={address} />

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
                                    <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(address || "") }}>
                                        <Copy className="mr-2 h-4 w-4" />
                                        <span>Copy Address</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Billing</span>
                                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { disconnect() }}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>}
                    </div>
                )
            })()}
        </div>
    </NavBarCommon>
}