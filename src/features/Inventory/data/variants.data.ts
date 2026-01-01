export type InventoryVariant = {
    id: number;
    productId: number;
    name: string;
    size: string;
    sku: string;
    location: string;
    quantity: number;
    image: string;
};

export const INVENTORY_VARIANTS: InventoryVariant[] = [
    // Blue Jersey T-Shirt variants (productId: 1)
    {
        id: 1,
        productId: 1,
        name: "Blue Jersey T-Shirt",
        size: "Small",
        sku: "TS01-BL-S",
        location: "S1-R1-W1",
        quantity: 20,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
    },
    {
        id: 2,
        productId: 1,
        name: "Blue Jersey T-Shirt",
        size: "Medium",
        sku: "TS01-BL-M",
        location: "S1-R1-W1",
        quantity: 20,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
    },
    {
        id: 3,
        productId: 1,
        name: "Blue Jersey T-Shirt",
        size: "Large",
        sku: "TS-01-BL-L",
        location: "S1-R1-W1",
        quantity: 20,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
    },
    {
        id: 4,
        productId: 1,
        name: "Blue Jersey T-Shirt",
        size: "X-Large",
        sku: "TS-01-BL-XL",
        location: "S1-R1-W1",
        quantity: 20,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
    },
    {
        id: 5,
        productId: 1,
        name: "Blue Jersey T-Shirt",
        size: "2X-Large",
        sku: "TS-01-BL-2XL",
        location: "S1-R1-W1",
        quantity: 20,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
    },
    // Camo T-Shirt variants (productId: 5)
    {
        id: 6,
        productId: 5,
        name: "Camo T-Shirt",
        size: "Small",
        sku: "TS02-CM-S",
        location: "R2-W1",
        quantity: 80,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200",
    },
    {
        id: 7,
        productId: 5,
        name: "Camo T-Shirt",
        size: "Medium",
        sku: "TS02-CM-M",
        location: "R2-W1",
        quantity: 80,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200",
    },
    {
        id: 8,
        productId: 5,
        name: "Camo T-Shirt",
        size: "Large",
        sku: "TS02-CM-L",
        location: "R2-W1",
        quantity: 80,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200",
    },
    {
        id: 9,
        productId: 5,
        name: "Camo T-Shirt",
        size: "X-Large",
        sku: "TS02-CM-XL",
        location: "R2-W1",
        quantity: 80,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200",
    },
];
