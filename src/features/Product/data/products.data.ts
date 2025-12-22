export const PRODUCTS = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  name: "Blue Jersey T-Shirt",
  category: "T-Shirts",
  sku: `TS01-BL-${i}`,
  location: "S1-R1-W1",
  quantity: 20 + i,
  image:
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200",
}));
