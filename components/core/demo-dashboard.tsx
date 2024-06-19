"use client"

import React, { use, useEffect, useState } from 'react';
import {
    Card,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Payment } from './payment';
import { Trash } from 'lucide-react';
import { CartItem, items, useCart } from '@/lib/utils/use-cart';
import { Button } from '@/components/ui/button';
import { SelectCurrency } from './demo/select-currency';
import { useStrase } from './connector-provider';
import { getFiatPrice, getSupportedCurrency } from '@/lib/price-feed';
import { getPriceFeedClient } from '@/lib/strase';
import { getContract } from 'viem';
import { abi } from '@/lib/utils/price-feed-abi';
import { convertUSDToCurrency } from '@/lib/functions';

export const getPublishableKey = async () => {
    const response = await fetch("/api/config", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    return data.publishableKey || "";
}

interface DemoDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
    handleStraseIntegration: Function
}

export const DemoDashboard = ({ handleStraseIntegration }: DemoDashboardProps) => {
    const { cart, total, addToCart, removeFromCart, handleQuantity } = useCart();
    const { currency, exchangeRate, setExchangeRate } = useStrase();

    const [clientSecret, setClientSecret] = useState<string>("");

    const [processingCheckout, setProcessingCheckout] = useState<boolean>(false);
    const handleCheckout = async () => {
        try {
            // cart.forEach((item) => {
            //     console.log(`Purchasing ${item.quantity} ${item.itemId}`);
            // });
            // console.log(`Total: $${total}`);

            setProcessingCheckout(true);
            // Need to convert to selected currency, as still in USD at this point
            let totalAmount = total;
            if (currency !== "usd" && exchangeRate[currency]) {
                totalAmount = convertUSDToCurrency(total, exchangeRate[currency].exchangeRate || BigInt(1), exchangeRate[currency].decimal || 1);
            }
            const data = await createPaymentIntent(totalAmount);
            console.log(data);
            setClientSecret(data.clientSecret);
        } catch (error) {
            console.error('Failed to checkout:', error);
        } finally {
            setProcessingCheckout(false)
        }
    }

    const createPaymentIntent = async (amount: number) => {
        // Calculate smallest currency unit
        const currencies = await getSupportedCurrency();
        const curr = currencies.find((c) => c.value.toLocaleLowerCase() === currency.toLocaleLowerCase());
        if (curr && curr.decimal) {
            amount = amount * (10 ** curr.decimal);
        }

        const response = await fetch('/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Convert the amount to cents
            body: JSON.stringify({ amount: amount, currency: currency })
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

    useEffect(() => {
        (async () => {
            console.log("Changing currency", currency)

            if (currency === "usd") {
                return;
            }

            if (exchangeRate[currency]) {
                return;
            }

            const priceFeed = await getFiatPrice(currency)
            const client = getPriceFeedClient();
            const contract = getContract({ address: priceFeed?.contractAddress || "0x", abi, client, })
            const conversion: bigint = await contract.read.latestAnswer() as bigint;
            const price = {
                exchangeRate: conversion || 0,
                decimal: priceFeed?.decimals || 0
            }
            setExchangeRate((prev: any) => ({ ...prev, [currency]: price }) as any)
        })()
    }, [currency])

    return <div className="h-max-[100vh] overflow-y-auto mb-32">
        <div className="mx-8">
            <div className="flex justify-between items-center">
                <div className="text-2xl font-semibold tracking-tight my-4">
                    Add Items
                </div>
                <div className="flex items-center space-x-2">
                    <div className="text-sm font-semibold">Try out Supported Currencies: {" "}</div>
                    <SelectCurrency />
                </div>
            </div>
            <div className="flex gap-2 overflow-x-auto mx-8">
                {items.map((item, index) => <Card key={index} className="!bg-white">
                    <CardHeader className="!w-[256px]">
                        <Image src={item.image} alt="img" width={176} height={176} />
                        <div className="font-semibold leading-none tracking-tight">{item.name}</div>
                        <CardDescription>${currency !== "usd" && exchangeRate[currency]
                            ? convertUSDToCurrency(item.price, exchangeRate[currency].exchangeRate || BigInt(1), exchangeRate[currency].decimal || 1) :
                            item.price} {currency.toUpperCase()}</CardDescription>
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

                        <div>Total: ${currency !== "usd" && exchangeRate[currency]
                            ? convertUSDToCurrency(total, exchangeRate[currency].exchangeRate || BigInt(1), exchangeRate[currency].decimal || 1) :
                            total} {currency.toUpperCase()}
                        </div>
                    </div>}
            </div>
            <div className="col-span-12 lg:col-span-5 container">
                <div className="text-2xl font-semibold tracking-tight my-4">
                    Payment Method
                </div>
                {clientSecret && <>
                    <Payment clientSecret={clientSecret} handleStraseIntegration={handleStraseIntegration} />
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
    const { currency, exchangeRate } = useStrase();
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
                        <CardDescription>${currency !== "usd" && exchangeRate[currency]
                            ? convertUSDToCurrency(product?.price, exchangeRate[currency].exchangeRate || BigInt(1), exchangeRate[currency].decimal || 1) :
                            product?.price} {currency.toUpperCase()}</CardDescription>
                        {item.quantity > 1 && <CardDescription>Total:
                            ${currency !== "usd" && exchangeRate[currency]
                                ? convertUSDToCurrency(product?.price, exchangeRate[currency].exchangeRate || BigInt(1), exchangeRate[currency].decimal || 1) * item.quantity :
                                product?.price * item.quantity} {currency.toUpperCase()}</CardDescription>}
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div>
                        <div className="flex space-x-2">
                            <Input type="number" value={item.quantity} onChange={(e) => onQuantityChange(item.itemId, parseInt(e.target.value))}
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