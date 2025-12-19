// Product Feature Types

export interface Product {
  id: number;
  name: string;
  sku: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFormData {
  name: string;
  sku: string;
  price: number;
  description: string;
  image?: File;
}

export interface ProductGroup {
  id: number;
  name: string;
  productIds: number[];
  createdAt?: Date;
}
