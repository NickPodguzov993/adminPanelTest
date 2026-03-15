import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { getProducts } from "../../features/products/api/productsApi";
import { ProductsTable } from "../../features/products/ui/ProductsTable";
import { sortProducts } from "../../features/products/model/sortProducts";
import { AddProductForm } from "../../features/add-product/ui/AddProductForm";
import {useDebounce} from "../../features/shared/hooks/useDebounce.ts";
import type {Product, SortField, SortState} from "../../features/auth/model/products.types.ts";


const LIMIT = 20;

function getPagination(
    currentPage: number,
    totalPages: number
): (number | "...")[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
        return [
            1,
            "...",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
    ];
}

export function ProductsPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);

    const [page, setPage] = useState(1);

    const [sort, setSort] = useState<SortState>({
        field: null,
        order: "asc",
    });

    const [localProducts, setLocalProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const skip = (page - 1) * LIMIT;

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
        setSelectedIds([]);
    };

    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ["products", debouncedSearch, page],
        queryFn: () =>
            getProducts({
                q: debouncedSearch.length >= 3 ? debouncedSearch : undefined,
                limit: LIMIT,
                skip,
            }),
        enabled: debouncedSearch.length === 0 || debouncedSearch.length >= 3,
    });

    const serverProducts = data?.products ?? [];
    const apiTotal = data?.total ?? 0;

    const mergedProducts = useMemo(() => {
        if (page !== 1) {
            return serverProducts;
        }

        const visibleLocalProducts = localProducts.slice(0, LIMIT);
        const remainingSlots = Math.max(0, LIMIT - visibleLocalProducts.length);
        const visibleServerProducts = serverProducts.slice(0, remainingSlots);

        return [...visibleLocalProducts, ...visibleServerProducts];
    }, [localProducts, serverProducts, page]);

    const sortedProducts = useMemo(() => {
        return sortProducts(mergedProducts, sort);
    }, [mergedProducts, sort]);

    const effectiveTotal = apiTotal + localProducts.length;
    const totalPages = Math.max(1, Math.ceil(effectiveTotal / LIMIT));

    const allSelected =
        sortedProducts.length > 0 &&
        sortedProducts.every((product) => selectedIds.includes(product.id));

    const startItem = effectiveTotal === 0 ? 0 : skip + 1;
    const endItem =
        effectiveTotal === 0 ? 0 : Math.min(skip + sortedProducts.length, effectiveTotal);

    const paginationItems = getPagination(page, totalPages);

    const handleSort = (field: SortField) => {
        setSort((prev) => {
            if (prev.field === field) {
                return {
                    field,
                    order: prev.order === "asc" ? "desc" : "asc",
                };
            }

            return {
                field,
                order: "asc",
            };
        });
    };

    const handleAddProduct = (values: {
        title: string;
        price: number;
        brand: string;
        sku: string;
    }) => {
        const newProduct: Product = {
            id: Date.now(),
            title: values.title,
            price: values.price,
            brand: values.brand,
            sku: values.sku,
            rating: 0,
            category: "Новая категория",
            thumbnail: "",
        };

        setLocalProducts((prev) => [newProduct, ...prev]);
        setIsModalOpen(false);
        setPage(1);
        toast.success("Товар успешно добавлен");
    };

    const handleToggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    const handleToggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds((prev) =>
                prev.filter((id) => !sortedProducts.some((product) => product.id === id))
            );
            return;
        }

        const currentPageIds = sortedProducts.map((product) => product.id);

        setSelectedIds((prev) => {
            const merged = new Set([...prev, ...currentPageIds]);
            return Array.from(merged);
        });
    };

    return (
        <div className="min-h-screen bg-[#f5f5f6] px-6 py-5">
            <div className="mx-auto flex max-w-[1840px] flex-col gap-7">
                <section className="flex min-h-[112px] items-center justify-between rounded-[10px] bg-white px-7">
                    <h1 className="text-[24px] font-bold text-[#2b2b2f]">Товары</h1>

                    <div className="flex w-full max-w-[1023px] items-center gap-2 rounded-lg border border-[#efefef] bg-[#f5f5f5] px-5 py-3">
                        <Search size={20} className="text-[#9ca3af]" />
                        <input
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Найти"
                            className="w-full bg-transparent text-sm text-[#2b2b2f] outline-none placeholder:text-[#9ca3af]"
                        />
                    </div>
                </section>

                <section className="rounded-xl bg-white px-7 py-7">
                    <div className="mb-10 flex items-center justify-between">
                        <h2 className="text-[20px] font-bold leading-5 text-[#2b2b2f]">
                            Все позиции
                        </h2>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#52525b] transition hover:bg-[#f8f8f8]"
                            >
                                <RefreshCw
                                    size={18}
                                    className={isFetching ? "animate-spin" : ""}
                                />
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="flex min-h-10 items-center gap-3.5 rounded-md bg-[#2d43e8] px-5 py-2.5 text-sm font-semibold text-[#e5e7eb] transition hover:bg-[#2438d6]"
                            >
                                <Plus size={18} />
                                Добавить
                            </button>
                        </div>
                    </div>

                    {(isLoading || isFetching) && (
                        <div className="mb-6 h-1 w-full overflow-hidden rounded bg-[#ececec]">
                            <div className="h-full w-1/3 animate-pulse bg-[#2d43e8]" />
                        </div>
                    )}

                    {isError && (
                        <p className="mb-6 text-sm text-red-500">
                            {error instanceof Error ? error.message : "Ошибка загрузки"}
                        </p>
                    )}

                    {!isLoading && !isError && (
                        <ProductsTable
                            products={sortedProducts}
                            sort={sort}
                            onSort={handleSort}
                            selectedIds={selectedIds}
                            allSelected={allSelected}
                            onToggleSelect={handleToggleSelect}
                            onToggleSelectAll={handleToggleSelectAll}
                        />
                    )}

                    <div className="mt-8 flex items-center justify-between py-2.5">
                        <div className="text-lg">
                            <span className="text-[#a1a1aa]">Показано </span>
                            <span className="text-[#2b2b2f]">
                {startItem}-{endItem}
              </span>
                            <span className="text-[#a1a1aa]"> из </span>
                            <span className="text-[#2b2b2f]">{effectiveTotal}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                className="text-[#a1a1aa] transition hover:text-[#52525b] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ‹
                            </button>

                            <div className="flex items-center gap-2">
                                {paginationItems.map((item, index) =>
                                        item === "..." ? (
                                            <span
                                                key={`dots-${index}`}
                                                className="flex h-7 min-w-7 items-center justify-center px-1 text-sm text-[#a1a1aa]"
                                            >
                      ...
                    </span>
                                        ) : (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => setPage(item)}
                                                className={`flex h-7 min-w-7 items-center justify-center rounded px-2 text-sm shadow-[0px_20px_50px_0px_rgba(0,0,0,0.12)] ${
                                                    page === item
                                                        ? "bg-[#818cf8] text-white"
                                                        : "border border-[#e5e7eb] text-[#a1a1aa]"
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        )
                                )}
                            </div>

                            <button
                                type="button"
                                disabled={page === totalPages}
                                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                className="text-[#a1a1aa] transition hover:text-[#52525b] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-[#2b2b2f]">
                                Добавить товар
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-[#a1a1aa] hover:text-[#2b2b2f]"
                            >
                                ✕
                            </button>
                        </div>

                        <AddProductForm onSubmit={handleAddProduct} />
                    </div>
                </div>
            )}
        </div>
    );
}