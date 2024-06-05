import { cn } from "@/lib/utils"
import { MoveRight } from "lucide-react"

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
    href?: string
    text?: string
}

export const Banner = ({
    href,
    text,
    className
}: BannerProps) => {
    return <div className={cn("flex justify-center", className)}>
        <a href={href || "#"} rel="noopener noreferrer" target="_blank"
            className="border text-sm border-amazon-900/10 rounded-full text-amazon-900/70 hover:bg-amazon-900/20 shadow-sm hover:shadow transition-all">
            <div className="border border-primary py-1 md:py-[4px] px-3 rounded-full bg-secondary text-white text-center flex items-center space-x-2">
                <span>
                    {text || "Join our community"}
                </span>
                <MoveRight />
            </div>
        </a>
    </div>
}