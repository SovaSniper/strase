"use client"

import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import { Input } from '../ui/input';
import Image from 'next/image';
import { Payment } from './payment';
import { Divide, Trash } from 'lucide-react';
import { CartItem, items, useCart } from '@/lib/utils/use-cart';

export const DemoDashboard = () => {
    const { signMessage, user } = usePrivy();
    const { cart, total, addToCart, removeFromCart, handleQuantity } = useCart();

    const [clientSecret, setClientSecret] = useState<string>("");

    // useEffect(() => {
    //     (async () => {
    //         const data = await createPaymentIntent(100);
    //         console.log(data);
    //         setClientSecret(data.clientSecret);
    //     })()
    // }, []);

    const [processingCheckout, setProcessingCheckout] = useState<boolean>(false);
    const handleCheckout = async () => {
        try {
            // cart.forEach((item) => {
            //     console.log(`Purchasing ${item.quantity} ${item.itemId}`);
            // });
            // console.log(`Total: $${total}`);

            setProcessingCheckout(true);
            const data = await createPaymentIntent(total);
            console.log(data);
            setClientSecret(data.clientSecret);
        } catch (error) {
            console.error('Failed to checkout:', error);
        } finally {
            setProcessingCheckout(false)
        }
    }

    const createPaymentIntent = async (amount: number) => {
        // Fetch the clientSecret from the backend
        const response = await fetch('/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount, currency: 'usd' })
        })

        if (!response.ok) {
            console.error('Failed to create payment intent:', response.statusText);
            return;
        }

        const data = await response.json();
        return data;
    }

    const handleBack = () => {
        setClientSecret("");
    }

    return <div className="h-max-[100vh] overflow-y-auto mb-32">
        <div className="mx-8">
            <div className="text-2xl font-semibold tracking-tight my-4">
                Add Items
            </div>
            <div className="flex gap-2 overflow-x-auto mx-8">
                {items.map((item, index) => <Card key={index} className="!bg-white">
                    <CardHeader className="!w-[256px]">
                        <Image src={item.image} alt="img" width={176} height={176} />
                        <div className="font-semibold leading-none tracking-tight">{item.name}</div>
                        <CardDescription>${item.price}</CardDescription>
                        <Button onClick={() => addToCart(item.name)}
                            disabled={cart.some(product => product.itemId === item.name) || !!clientSecret}>Add</Button>
                    </CardHeader>
                </Card>)}
            </div>
        </div>

        <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-7 container">
                <div className="text-2xl font-semibold tracking-tight my-4">
                    Shopping Summary
                </div>
                <div className="">
                    {cart.map((item, index) =>
                        <CheckoutItem key={index} item={item}
                            onRemove={removeFromCart}
                            onQuantityChange={handleQuantity}
                            disabled={!!clientSecret} />)}
                </div>
                {cart.length > 0 && !clientSecret &&
                    <div className="flex items-center justify-between">
                        <Button onClick={handleCheckout} disabled={processingCheckout} className="mt-4">
                            {!processingCheckout ? "Checkout" : "Processing..."}
                        </Button>

                        <div>Total: ${total}</div>
                    </div>}
            </div>
            <div className="col-span-12 lg:col-span-5 container">
                <div className="text-2xl font-semibold tracking-tight my-4">
                    Payment Method
                </div>
                {clientSecret && <>
                    <Payment clientSecret={clientSecret} />
                    <Button className="mt-4" onClick={handleBack}>
                        Back
                    </Button>
                </>}
            </div>
        </div>
    </div>
}

export const CheckoutItem = ({
    item,
    onRemove,
    onQuantityChange,
    disabled = false
}: {
    item: CartItem,
    onRemove: Function,
    onQuantityChange: Function,
    disabled?: boolean
}) => {
    const [product, setProduct] = useState<any>({} as any);

    useEffect(() => {
        const product = items.filter((i) => i.name === item.itemId).pop();
        setProduct(product);
    }, [item.itemId]);

    return <Card className="border-none shadow-none !bg-white">
        <CardHeader className="p-2">
            <div className="flex justify-between">
                <div className="flex items-center justify-center space-x-4">
                    <Image src={product?.image || ""} alt="img" width={96} height={96} />
                    <div>
                        <div className="font-semibold leading-none tracking-tight">{item.itemId}</div>
                        <CardDescription>${product?.price || "Unknown"}</CardDescription>
                        {item.quantity > 1 && <CardDescription>Total: ${product?.price * item.quantity}</CardDescription>}
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div>
                        <div className="flex space-x-2">
                            <Input type="number" value={item.quantity} onChange={() => onQuantityChange(item.itemId)}
                                min={1} max={10} disabled={disabled} />
                            <Button variant="link" size="icon" className="w-full text-destructive"
                                disabled={disabled} onClick={() => onRemove(item.itemId)}>
                                <Trash />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </CardHeader>
    </Card>
}