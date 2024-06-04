import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "./checkout";
import { loadStripe } from "@stripe/stripe-js";

interface PaymentProps extends React.HTMLAttributes<HTMLDivElement> {
    clientSecret: string;
}

export const Payment = ({ clientSecret }: PaymentProps) => {
    const [stripePromise, setStripePromise] = useState<any>(null);

    useEffect(() => {
        (async () => {
            console.log("rendering checkout", clientSecret)

            const response = await fetch("/api/config", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            setStripePromise(loadStripe(data.publishableKey));
        })()
    }, [clientSecret])

    return <Elements stripe={stripePromise} options={{ clientSecret }}>
        {/* {clientSecret && clientSecret} */}
        <CheckoutForm />
    </Elements>
}