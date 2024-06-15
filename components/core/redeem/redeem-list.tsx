"use client"

import { useEffect, useState } from "react"
import { Button, buttonVariants } from "../../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../../ui/input"
import { DEFAULT_NETWORK, StraseStore } from "@/lib/strase"
import { formatEther } from "viem"
import { getStoreGiftAddress, getStoreTokenAddress } from "strase"
import { toast } from "sonner"

interface RedeemListProps extends React.HTMLAttributes<HTMLDivElement> {
    handleRedeemIntegration: Function
}

export const RedeemList = ({ handleRedeemIntegration }: RedeemListProps) => {
    const [store, setStore] = useState<StraseStore[]>([])
    const [isRedeeming, setIsRedeeming] = useState(false)

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/redeem")
            const data: { results: StraseStore[] } = await response.json()
            console.log(data)
            setStore(data.results)
        })()
    }, [])

    const handleRedeem = async (item: StraseStore) => {
        try {
            setIsRedeeming(true)
            if (item.contract === getStoreGiftAddress(DEFAULT_NETWORK)) {
                console.log("gift", item.contract, args)
            } else if (item.contract === getStoreTokenAddress(DEFAULT_NETWORK)) {
                await handleRedeemIntegration(item)
            }
        } catch (error: any) {
            console.error("error")
            toast.error(error.message || "An unknown error occurred")
        } finally {
            console.log("finally")
            setIsRedeeming(false)
            setArgs({})
        }
    }

    const [args, setArgs] = useState<any>({})
    const handleContract = (open: boolean, item: any) => {
        setArgs({})
    }

    const handleArgsChange = (key: string, value: string) => {
        setArgs({ ...args, [key]: value })
    }

    return <div>
        <div className="grid grid-cols-12 gap-4">
            {store.map((item, index) => <div className="col-span-12 lg:col-span-6 lg:col-span-4" key={index}>
                <div className="flex items-center justify-center">
                    <div>
                        <img className="rounded-lg object-cover h-48 w-96" src={item.image} alt="item" />
                        <div className="font-medium text-3xl">{item.name}</div>
                        <div className="flex items-center justify-between">
                            <div>Requirements: {formatEther(BigInt(item.amount))} SB</div>
                            <Dialog onOpenChange={(open: boolean) => handleContract(open, item)} key={index}>
                                <DialogTrigger className={buttonVariants({ variant: "default" })}>Redeem</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Congratulation. Ready to claim!</DialogTitle>
                                        <DialogDescription>
                                            Note as testnet, these redemptions are not real and will not have any value.
                                        </DialogDescription>
                                    </DialogHeader>
                                    {item.abi && <>
                                        {/* {JSON.stringify(item.abi)} */}
                                        {item.abi.inputs.map((input: any, index: number) => <div key={index}>
                                            {input.name}
                                            <Input type="text" onChange={(e) => handleArgsChange(input.name, e.target.value)} />
                                        </div>)}
                                    </>}
                                    <Button onClick={() => handleRedeem(item)} disabled={isRedeeming}>
                                        {isRedeeming ? "Redeeming ..." : "Redeem"}
                                    </Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    </div>
}