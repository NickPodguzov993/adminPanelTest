export type Product = {
    id: number;
    title: string;
    price: number;
    brand: string;
    sku: string;
    rating: number;
    stock?: number;
    category?: string;
    thumbnail?: string;
};

export type ProductsResponse = {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
};

export type SortField = "title" | "price" | "rating" | "brand" | "sku";
export type SortOrder = "asc" | "desc";

export type SortState = {
    field: SortField | null;
    order: SortOrder;
};