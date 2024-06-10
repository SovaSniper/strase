"use client"

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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

export const NavBar = ({ children }: NavBarProps) => {
    const router = useRouter();

    return <nav className={cn("sticky top-0 z-40 border-b border-transparent group bg-white/20 backdrop-blur is-active border-zinc-950/10")}>
        <div className="flex h-16 items-center justify-between py-6 container">
            <div className="flex gap-6 md:gap-10">
                <div className="text-3xl font-semibold tracking-tight hover:cursor-pointer hover:text-primary" onClick={() => router.push("/")}>Strase</div>
                {navItems.map((item) => (
                    <div key={item.title} className={cn("flex items-center font-medium cursor-pointer transition-colors hover:text-foreground/80 sm:text-lg text-foreground/60")}
                        onClick={() => router.push(item.href)}>
                        {item.title}
                    </div>))}
            </div>

            <div>
                {children}
            </div>
        </div>
    </nav>
}