import { useEffect, useState } from "react";

export const items = [
    {
        name: 'AMD Ryzen 7 5700X 8 Core AM4 3.4GHz Unlocked CPU Processor',
        image: '/images/62627_P_1649288539168.webp',
        description: '',
        price: 248,
    },
    {
        name: 'Gigabyte Radeon RX 7900 XTX Gaming OC 24G Graphics Card',
        image: '/images/Gigabyte-Radeon-RX-7900-XTX-Gaming-OC-24G-Graphics-Card-8.webp',
        description: '',
        price: 999,
    },
    {
        name: 'Crucial P3 Plus 2TB PCIe Gen4 M.2 2280 NVMe SSD',
        image: '/images/SSD-Hard-Drives-Crucial-P3-Plus-2TB-M-2-PCIe-SSD-3.webp',
        description: '',
        price: 178,
    },
    {
        name: 'Kingston NV2 1TB PCIe 4.0 M.2 2280 NVMe SSD',
        image: '/images/SSD-Hard-Drives-Kingston-1TB-NV2-2280-NVMe-SSD-6.webp',
        description: '',
        price: 92,
    },
    {
        name: 'AMD Ryzen 5 5500 6 Core AM4 4.20GHz CPU Processor with Wraith Stealth Cooler',
        image: '/images/62861_P_1651545460681.webp',
        description: '',
        price: 479,
    },
    {
        name: 'Gigabyte GeForce RTX 4060 WindForce OC 8G Graphics Card',
        image: '/images/Gigabyte-GeForce-RTX-4060-WindForce-OC-8G-Graphics-Card-8.webp',
        description: '',
        price: 92,
    },
    {
        name: 'MSI B550M PRO-VDH WiFi AM4 mATX Motherboard',
        image: '/images/56145_P_1595480051501.webp',
        description: '',
        price: 159,
    },
    {
        name: 'Asus Prime B550M-A WiFi II mATX AM4 Motherboard',
        image: '/images/AMD-AM4-Asus-Prime-B550M-A-WiFi-II-mATX-AM4-Motherboard-6.webp',
        description: '',
        price: 152,
    },
    {
        name: 'Logitech USB Unifying Receiver',
        image: '/images/56303_P_1596542063720.webp',
        description: '',
        price: 9,
    },
    {
        name: 'Screwdriver Sets 142-Piece Electronics Precision Screwdriver',
        image: '/images/Computer-Accessories-Screwdriver-Sets-142-Piece-Electronics-Precision-Screwdriver-with-120-Bits-Magnetic-Repair-Tool-Kit-for-iPhone-MacBook-Computer-Laptop-PC-Tablet-20.webp',
        description: '',
        price: 24,
    },
    {
        name: 'Asus GeForce GT730 GDDR5 2G Low Profile Graphics Card',
        image: '/images/60644_P_1632353455443.webp',
        description: '',
        price: 69,
    },
]

export interface CartItem {
    itemId: string;
    quantity: number;
}

export const useCart = () => {
    const [total, setTotal] = useState<number>(0);
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        let total = 0;
        cart.forEach((item) => {
            const product = items.filter((i) => i.name === item.itemId).pop();
            if (product) {
                total += product.price * item.quantity;
            }
        });

        setTotal(total);
    }, [cart])

    const addToCart = (itemId: string) => {
        setCart([...cart, { itemId, quantity: 1 }]);
    }

    const removeFromCart = (itemId: string) => {
        setCart(cart.filter(product => product.itemId !== itemId));
    }

    const handleQuantity = (itemId: string) => {
        const newCart = cart.map(product => {
            if (product.itemId === itemId) {
                return { ...product, quantity: product.quantity + 1 };
            }
            return product;
        });
        setCart(newCart);
    }

    return {
        total,
        cart,
        addToCart,
        removeFromCart,
        handleQuantity
    }
}