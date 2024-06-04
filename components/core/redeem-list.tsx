"use client"

import { useEffect, useState } from "react"
import { Button, buttonVariants } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"

interface RedeemListProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const RedeemList = ({ }: RedeemListProps) => {
    const [store, setStore] = useState<any[]>([])

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/redeem")
            const data: { results: any[] } = await response.json()
            console.log(data)
            setStore(data.results)
        })()
    }, [])

    const handleRedeem = async (item: any) => {
        console.log("redeem", item.contract, args)
    }

    const [args, setArgs] = useState<any>({})
    const handleContract = (open: boolean, item: any) => {
        setArgs({})
    }

    const handleArgsChange = (key: string, value: string) => {
        setArgs({ ...args, [key]: value })
    }

    return <div>
        <div className="grid grid-cols-12">
            {store.map((item, index) => <div className="col-span-12 lg:col-span-6 lg:col-span-4" key={index}>
                <div className="flex items-center justify-center">
                    <div>
                        <img className="rounded-lg object-cover h-48 w-96" src={item.image} alt="item" />
                        <div className="font-medium text-3xl">{item.name}</div>
                        <div>{item.amount}</div>
                        <Dialog onOpenChange={(open) => handleContract(open, item)} key={index}>
                            <DialogTrigger className={buttonVariants({ variant: "default" })}>Open</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                                {item.abi && <>
                                    {/* {JSON.stringify(item.abi)} */}
                                    {item.abi.inputs.map((input: any, index: number) => <div key={index}>
                                        {input.name}
                                        <Input type="text" onChange={(e) => handleArgsChange(input.name, e.target.value)} />
                                    </div>)}
                                </>}
                                <Button onClick={() => handleRedeem(item)}>Redeem</Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>)}
        </div>
    </div>
}