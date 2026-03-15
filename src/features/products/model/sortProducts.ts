import type {Product, SortState} from "../../auth/model/products.types.ts";


export function sortProducts(products: Product[], sort: SortState): Product[] {
    if (!sort.field) {
        return products;
    }

    const field = sort.field;

    return [...products].sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if (typeof aValue === "number" && typeof bValue === "number") {
            return sort.order === "asc" ? aValue - bValue : bValue - aValue;
        }

        const aString = String(aValue ?? "").toLowerCase();
        const bString = String(bValue ?? "").toLowerCase();

        if (aString < bString) {
            return sort.order === "asc" ? -1 : 1;
        }

        if (aString > bString) {
            return sort.order === "asc" ? 1 : -1;
        }

        return 0;
    });
}