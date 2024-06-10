"use client"

import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { ConnectWallet } from "./connect-wallet";
import { Profile } from "./profile";
import { NavBar as NavBarCommon } from '../navbar';

interface NavBarProps extends React.HTMLAttributes<HTMLDivElement> { }

export const NavBar = ({ }: NavBarProps) => {
    const {
        ready,
        authenticated,
        user,
    } = usePrivy();

    useEffect(() => {
        if (!ready) {
            return;
        }

        console.log('user', user);
    }, [ready, authenticated]);

    return <NavBarCommon>
        <div>
            {user?.id
                ? <Profile />
                : <ConnectWallet />}
        </div>
    </NavBarCommon>
}