import { DEFAULT_NETWORK, StraseStore } from "@/lib/strase";
import { StoreToken, StraseBuck } from "strase";
import { RedeemList } from "@/components/core/redeem/redeem-list";
import { toast } from "sonner"
import { useAccount } from "wagmi";
import { UnsignedTransactionRequest, SendTransactionModalUIOptions, useSendTransaction } from "@privy-io/react-auth";

interface RedeemProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const Redeem = ({ }: RedeemProps) => {
    const { address, status } = useAccount();
    const { sendTransaction } = useSendTransaction();

    const createTransactionRequest = (
        to: string = "0x",
        data: string = "0x",
        gasLimit: number = 3_000_000
    ): UnsignedTransactionRequest => {
        return {
            to,
            chainId: parseInt(DEFAULT_NETWORK),
            data,
            gasLimit,
            // gasPrice: 8000000000,
            // value: '0x3B9ACA00',
        } as UnsignedTransactionRequest;
    }
    const handleRedeemIntegration = async (item: StraseStore, args: any[]) => {
        if (!address) {
            throw new Error("Address is required")
        }

        const store = new StoreToken({ chain: DEFAULT_NETWORK, })
        console.log(store.contract.address, item.amount)

        // Approve first
        toast("Approving Strase Buck ...")
        const token = new StraseBuck({ chain: DEFAULT_NETWORK, });
        const approveData = await token.approveEncode(store.contract.address, item.amount)
        const approveRequest = createTransactionRequest(token.contract.address, approveData);

        const uiConfig: SendTransactionModalUIOptions = {
            header: 'Strase Redeem',
            description: 'To Redeem. Approve the payout Strase Bucks',
            buttonText: 'Approve',
        };
        console.log(approveRequest)
        const approvedResult = await sendTransaction(approveRequest, uiConfig);
        toast(`Strase Buck approved for ${approvedResult.transactionHash}`)

        // Accept redeem
        toast("Redeeming with Strase Buck ...")
        const redeemData = await store.redeemEncode(item.id)
        const redeemRequest = createTransactionRequest(store.contract.address, redeemData);

        uiConfig.description = "Confirm the payout Strase Bucks";
        uiConfig.buttonText = "Confirm";
        const redeemResult = await sendTransaction(redeemRequest, uiConfig);
        toast(`Offer Redeemed ${redeemResult.transactionHash}`)
    }

    return <RedeemList handleRedeemIntegration={handleRedeemIntegration} />
}