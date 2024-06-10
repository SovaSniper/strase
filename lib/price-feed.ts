import { getContract } from "viem";
import { getPriceFeedClient } from "./strase";

export const getFiatPrice = async (currency: string): Promise<ForexFeed | undefined> => {
    const response = await fetch("https://reference-data-directory.vercel.app/feeds-matic-mainnet.json");
    const data: ForexFeed[] = await response.json();

    const feed = data
        .filter((feed) => feed.feedCategory === "low")
        .filter((feed) => feed.docs.assetClass === "Fiat")
        .filter((feed) => feed.docs.baseAsset.toLocaleLowerCase() === currency.toLocaleLowerCase() &&
            feed.docs.quoteAsset.toLocaleLowerCase() === "usd".toLocaleLowerCase())
        .pop();

    return feed;
}

export const getSupportedCurrency = async (): Promise<{ value: string, label: string, decimal?: number }[]> => {
    // const response = await fetch("https://reference-data-directory.vercel.app/feeds-matic-mainnet.json");
    // const data: ForexFeed[] = await response.json();

    // const currencies = data
    //     .filter((feed) => feed.feedCategory === "low")
    //     .filter((feed) => feed.docs.assetClass === "Fiat")
    //     .map((feed) => ({
    //         value: feed.docs.baseAsset.toLocaleLowerCase(),
    //         label: feed.docs.assetName
    //     }))

    const currencies = [
        {
            "value": "usd",
            "label": "US Dollar",
            "decimal": 2,
        },
        {
            "value": "php",
            "label": "Philippines Peso",
            "decimal": 2,
        },
        {
            "value": "krw",
            "label": "Korean Won",
            "decimal": 0,
        },
        {
            "value": "mxn",
            "label": "Mexican Peso",
            "decimal": 2,
        },
        {
            "value": "gbp",
            "label": "Pound Sterling",
            "decimal": 2,
        },
        {
            "value": "idr",
            "label": "Indonesian Rupiah",
            "decimal": 2,
        },
        {
            "value": "sgd",
            "label": "Singapore Dollar",
            "decimal": 2,
        },
        {
            "value": "eur",
            "label": "Euro",
            "decimal": 2,
        },
        {
            "value": "ils",
            "label": "Israeli Shekel",
            "decimal": 2,
        },
        {
            "value": "inr",
            "label": "Indian Rupee",
            "decimal": 2,
        },
        {
            "value": "zar",
            "label": "South African Rand",
            "decimal": 2,
        },
        {
            "value": "cny",
            "label": "Chinese Yuan",
            "decimal": 2,
        },
        {
            "value": "pln",
            "label": "Polish Zloty",
            "decimal": 2,
        },
        {
            "value": "brl",
            "label": "Brazilian Real",
            "decimal": 2,
        },
        {
            "value": "aud",
            "label": "Australian Dollar",
            "decimal": 2,
        },
        {
            "value": "thb",
            "label": "Thai Baht",
            "decimal": 2,
        },
        {
            "value": "chf",
            "label": "Swiss Franc",
            "decimal": 2,
        },
        {
            "value": "cad",
            "label": "Canadian Dollar",
            "decimal": 2,
        },
        {
            "value": "try",
            "label": "Turkish Lira",
            "decimal": 2,
        },
        {
            "value": "sek",
            "label": "Swedish Krona",
            "decimal": 2,
        },
        {
            "value": "nzd",
            "label": "New Zealand Dollar",
            "decimal": 2,
        },
        {
            "value": "jpy",
            "label": "Japanese Yen",
            "decimal": 0,
        }
    ]

    return currencies;
}

interface Docs {
    assetClass: string;
    assetName: string;
    baseAsset: string;
    baseAssetClic: string;
    blockchainName: string;
    clicProductName: string;
    deliveryChannelCode: string;
    feedCategory: string;
    feedType: string;
    marketHours: string;
    productSubType: string;
    productType: string;
    productTypeCode: string;
    quoteAsset: string;
    quoteAssetClic: string;
}

interface ForexFeed {
    compareOffchain: string;
    contractAddress: `0x${string}`;
    contractType: string;
    contractVersion: number;
    decimalPlaces: number | null;
    ens: string;
    formatDecimalPlaces: number | null;
    healthPrice: string;
    heartbeat: number;
    history: string | null;
    multiply: string;
    name: string;
    pair: [string, string];
    path: string;
    proxyAddress: string;
    threshold: number;
    valuePrefix: string;
    assetName: string;
    feedCategory: string;
    feedType: string;
    docs: Docs;
    decimals: number;
}
