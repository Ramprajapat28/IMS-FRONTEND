export interface SellingProduct {
    product_id: number;
    name: string;
    total_sold: number;
    // total_sales: number;
    trend: number; // Percent change, can be calculated or passed from backend
    image?: string;
}

export interface StockProduct {
    product_id: number;
    product_name: string;
    available_count: number;
    stock_status: "low_stock" | "out_of_stock";
    image?: string;
}

export interface StockStatusCounts {
    low_stock_products: number;
    out_of_stock_products: number;
}

export interface StockStatusResponse {
    stock_status: StockStatusCounts;
    products: StockProduct[];
}

export interface DashboardAnalytics {
    topSelling: SellingProduct[];
    leastSelling: SellingProduct[];
    stockStatus?: StockStatusResponse;
}

export interface CategoryCount {
    category_id: number;
    category_name: string;
    total_products: number;
}
