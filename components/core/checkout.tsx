import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CheckoutFormProps extends React.HTMLAttributes<HTMLDivElement> {
    handleStraseIntegration: Function
}

export const CheckoutForm = ({ handleStraseIntegration }: CheckoutFormProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    const handleSubmit = async (event: any) => {
        try {
            event.preventDefault();
            setIsProcessing(true);
            await trySubmit();
        } catch (error: any) {
            toast.error(error.message || "An unknown error occurred")
            setMessage(error.message || "An unknown error occurred");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    }

    const trySubmit = async () => {
        // Stripe Payment
        let paymentIntentClientSecret = ""
        try {
            toast("Processing payment ...")
            const paymentIntent = await confirmStripePayment();
            paymentIntentClientSecret = paymentIntent.client_secret || "";
            setMessage("Payment successful");
            toast("Processing successful ...")
        }
        catch (error: any) {
            throw new Error(error.message || "An unknown error occurred");
        }

        try {
            // const paymentIntentClientSecret = "pi_3PPJeRRuZyF18QqG1ug0ej6d_secret_Apc79NO6EKL76H4FvgJQvYPa5"
            setClientSecret(paymentIntentClientSecret);
            await handleStraseIntegration(paymentIntentClientSecret);
        } catch (error: any) {
            // console.error(error);
            throw new Error(`Payment for successfully, however failed redeeming Strase Buck. Please try again with ${paymentIntentClientSecret}`);
        }
    };

    const confirmStripePayment = async () => {
        if (!stripe || !elements) {
            throw new Error("Stripe.js has not loaded yet. Make sure to disable the submit button until Stripe.js has loaded.");
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required"
        });

        if (error) {
            throw new Error(error.message || "An unknown error occurred");
        }

        return paymentIntent;
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <Button disabled={isProcessing || !stripe || !elements} id="submit" className="w-full mt-2">
                <span id="button-text">
                    {isProcessing ? "Processing ... " : "Pay now"}
                </span>
            </Button>
            {clientSecret && <div>
                Receipt: {clientSecret}
            </div>}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}