import {apiClient} from "../../shared/api/client.ts";
import type {ProductsResponse} from "../../auth/model/products.types.ts";

export async function getProducts(params?: {
    limit?: number;
    skip?: number;
    q?: string;
}): Promise<ProductsResponse> {
    const limit = params?.limit ?? 20;
    const skip = params?.skip ?? 0;
    const q = params?.q?.trim();

    if (q) {
        return apiClient<ProductsResponse>(
            `/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
        );
    }

    return apiClient<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
}