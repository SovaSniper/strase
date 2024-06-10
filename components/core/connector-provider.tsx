"use client"

import React, { createContext, useContext, useState } from "react"

export const StraseProvider = ({ children }: StraseProviderProps) => {
    const [walletOption, setWalletOption] = useState<WalletConnectorType>("smart-wallet")
    const [currency, setCurrency] = useState<string>("usd")
    const [exchangeRate, setExchangeRate] = useState<RateType>({})

    return <StraseContext.Provider
        value={{
            walletOption,
            setWalletOption,
            currency,
            setCurrency,
            exchangeRate,
            setExchangeRate
        }}
    >
        {children}
    </StraseContext.Provider>
}

interface StraseProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string
}

export type WalletConnectorType = "privy" | "smart-wallet"

export const StraseContext = createContext({
    walletOption: "smart-wallet",
    setWalletOption: (option: WalletConnectorType) => { },
    currency: "usd",
    setCurrency: (currency: string) => { },
    exchangeRate: {} as RateType,
    setExchangeRate: (exchangeRate: any) => { }
})

interface RateType {
    [key: string]: {
        exchangeRate: bigint,
        decimal: number
    }
}


export const useStrase = () => useContext(StraseContext)