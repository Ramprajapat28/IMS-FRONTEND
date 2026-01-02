export interface Product {
    product_id: number;
    name: string;
    sku: string;
    category_name?: string;
    category?: string; // For compatibility
    category_id?: number;
    description?: string;
    reorder_level?: number;
    stock_quantity?: number;
    location?: string;
    size?: string;
    stock_details?: {
        product_id: number;
        warehouse_name: string;
        room_name: string;
        shelf_name: string;
        status: string;
        item_count: number | string;
    }[];
    product_image?: string;
    barcode_image?: string;
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

export interface ProductFormData {
    name: string;
    sku: string;

    description: string;
    image?: File;
}

export interface ProductGroup {
    id: number;
    name: string;
    productIds: number[];
    createdAt?: Date;
}
