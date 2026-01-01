export interface Product {
    product_id: number;
    name: string;
    sku: string;
    category?: string;
    description?: string;
    reorder_level?: number;
    stock_quantity?: number;
    location?: string;
    stock_details?: {
        item_id: number;
        product_id: number;
        warehouse_name: string;
        room_name: string;
        shelf_name: string;
        status: string;
    }[];
    product_image?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateProductData {
    name: string;
    sku: string;
    category?: string;
    description?: string;
    reorder_level?: number;
}
