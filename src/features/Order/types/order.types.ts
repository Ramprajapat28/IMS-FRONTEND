export interface Order {
    order_id: number;
    product_id: number;
    shelf_id: number;
    rack_id?: number;
    quantity: number;
    status: string;
    product_name?: string;
    product_sku?: string;
    warehouse_name?: string;
    room_name?: string;
    shelf_name?: string;
    rack_name?: string;
    rack_room_name?: string;
    rack_warehouse_name?: string;
    created_at?: string;
    updated_at?: string;
    category_name?: string;
    mode?: string;
    inward_dates?: { date: string; count: number }[];
    user_name?: string;
}

export interface OrderFilters {
    product_id?: number;
    shelf_id?: number;
    rack_id?: number;
    status?: string;
}
