export interface SellingProduct {
    product_id: number;
    name: string;
    total_quantity: number;
    total_sales: number;
    trend: number; // Percent change, can be calculated or passed from backend
    image?: string;
}

export interface DashboardAnalytics {
    topSelling: SellingProduct[];
    leastSelling: SellingProduct[];
}
