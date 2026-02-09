export interface Product {
    product_id: number;
    name: string;
    sku: string;
    category_name?: string;
    category?: string; // For compatibility
    category_id?: number;
    global_category_id?: number;
    global_category_name?: string;
    description?: string;
    reorder_level?: number;
    stock_quantity?: number;
    mrp?: number;
    discounted_price?: number;
    gst_percentage?: number;
    cost_to_company?: number;
    location?: string;
    size?: string;
    product_code?: string;
    hsn_code?: string;
    stock_details?: {
        product_id: number;
        warehouse_name: string;
        room_name: string;
        shelf_name: string;
        rack_name?: string;
        is_rack?: boolean;
        status: string;
        item_count: number | string;
    }[];
    product_image?: any;
    barcode_image?: string;
    created_at?: string;
    updated_at?: string;
    last_added_date?: string;
}

export interface CreateProductData {
    name: string;
    sku: string;
    product_code?: string;
    hsn_code?: string;
    category?: string;
    global_category_id?: number;
    description?: string;
    reorder_level?: number;
    size?: string;
    mrp?: number;
    discounted_price?: number;
    gst_percentage?: number;
    cost_to_company?: number;
    product_image?: {
        file_path: string;
        view: string;
    }[];
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
