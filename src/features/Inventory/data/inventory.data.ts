export type InventoryProduct = {
    id: number;
    name: string;
    category: string;
    sku: string;
    location: string;
    quantity: number;
    image: string;
    hasVariants: boolean;
};

export const INVENTORY_PRODUCTS: InventoryProduct[] = [
    {
        id: 1,
        name: "Blue Jersey T-Shirt",
        category: "T-Shirts",
        sku: "-----",
        location: "R1-W1",
        quantity: 100,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
        hasVariants: true,
    },
    {
        id: 2,
        name: "Sena Cap Green",
        category: "Caps",
        sku: "CP1-GR",
        location: "S2-R1-W1",
        quantity: 140,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200",
        hasVariants: false,
    },
    {
        id: 3,
        name: "Stainless Steel Bottle",
        category: "Bottles",
        sku: "BT1-BLK",
        location: "S1-R2-W1",
        quantity: 300,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200",
        hasVariants: false,
    },
    {
        id: 4,
        name: "The Soldier Mug",
        category: "Mugs",
        sku: "MG1-SLD",
        location: "S2-R2-W1",
        quantity: 450,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200",
        hasVariants: false,
    },
    {
        id: 5,
        name: "Camo T-Shirt",
        category: "T-Shirts",
        sku: "-----",
        location: "R2-W1",
        quantity: 320,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200",
        hasVariants: true,
    },
    {
        id: 6,
        name: "Balldaan iPhone Case - Camo",
        category: "Cases",
        sku: "CS1-CM",
        location: "S1-R1-W2",
        quantity: 650,
        image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200",
        hasVariants: false,
    },
    {
        id: 7,
        name: "Red Premium Satchel",
        category: "Bags",
        sku: "PT007",
        location: "Dior",
        quantity: 700,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200",
        hasVariants: false,
    },
    {
        id: 8,
        name: "iPhone 14 Pro",
        category: "Phone",
        sku: "PT008",
        location: "Apple",
        quantity: 630,
        image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=200",
        hasVariants: false,
    },
    {
        id: 9,
        name: "Gaming Chair",
        category: "Furniture",
        sku: "PT009",
        location: "Airline",
        quantity: 410,
        image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=200",
        hasVariants: false,
    },
    {
        id: 10,
        name: "Borealis Backpack",
        category: "Bags",
        sku: "PT010",
        location: "The North Face",
        quantity: 550,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200",
        hasVariants: false,
    },
];
