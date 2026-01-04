export interface InventoryProduct {
    id: number;
    name: string;
    category: string;
    sku: string;
    realSku?: string;
    location: string;
    quantity: number;
    type?: string;
}
