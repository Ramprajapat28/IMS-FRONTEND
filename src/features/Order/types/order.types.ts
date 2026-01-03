export interface Order {
    order_id: number;
    product_id: number;
    shelf_id: number;
    quantity: number;
    status: string;
    product_name?: string;
    product_sku?: string;
    warehouse_name?: string;
    room_name?: string;
    shelf_name?: string;
    created_at?: string;
    updated_at?: string;
    category_name?: string;
    mode?: string;
}

export interface OrderFilters {
    product_id?: number;
    shelf_id?: number;
    status?: string;
}
