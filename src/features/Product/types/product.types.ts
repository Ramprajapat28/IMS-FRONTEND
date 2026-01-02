export interface Product {
    product_id: number;
    name: string;
    sku: string;
    category_name?: string;
    category_id?: number;
    description?: string;
    reorder_level?: number;
    stock_quantity?: number;
    location?: string;
    size?: string;
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
