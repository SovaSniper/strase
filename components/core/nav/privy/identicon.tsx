import { blo } from "blo";

interface IdenticonProps extends React.HTMLAttributes<HTMLImageElement> {
    address: `0x${string}`;
}

export const Identicon = ({ address, ...props }: IdenticonProps) => {
    return <img className="rounded-full" alt={address} src={blo(address)} {...props} width={36} />
}