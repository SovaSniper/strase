import { DEFAULT_NETWORK, StraseStore } from "@/lib/strase";
import { StoreToken, StraseBuck } from "strase";
import { sendTransaction } from '@wagmi/core'
import { RedeemList } from "@/components/core/redeem/redeem-list";
import { config } from "@/components/providers";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner"

interface RedeemProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const Redeem = ({ }: RedeemProps) => {
    const { address, status } = useAccount();

    const handleSendTransactiion = async (to: `0x${string}`, data: `0x${string}`) => {
        return await sendTransaction(config, {
            to,
            data,
            gasPrice: BigInt(3_000_000),
        })
    }
    const handleRedeemIntegration = async (item: StraseStore, args: any[]) => {
        if (!address) {
            throw new Error("Address is required")
        }

        const store = new StoreToken({ chain: DEFAULT_NETWORK, })

        // Approve first
        toast("Approving Strase Buck ...")
        const token = new StraseBuck({ chain: DEFAULT_NETWORK, });
        const approveData = await token.approveEncode(store.contract.address, item.amount)
        const approvedResult = await handleSendTransactiion(token.contract.address, approveData)
        toast(`Strase Buck approved for ${approvedResult}`)

        // Accept redeem
        toast("Redeeming with Strase Buck ...")
        const redeemData = await store.redeemEncode(item.id)
        const redeemResult = await handleSendTransactiion(store.contract.address, redeemData)
        toast(`Offer Redeemed ${redeemResult}`)
    }

    return <RedeemList handleRedeemIntegration={handleRedeemIntegration} />
}