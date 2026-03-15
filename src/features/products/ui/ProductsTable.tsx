import { MoreHorizontal, Plus } from "lucide-react";
import type {Product, SortField, SortState} from "../../auth/model/products.types.ts";


type Props = {
    products: Product[];
    sort: SortState;
    onSort: (field: SortField) => void;
    selectedIds: number[];
    allSelected: boolean;
    onToggleSelect: (id: number) => void;
    onToggleSelectAll: () => void;
};

function formatPrice(price: number) {
    const formatted = new Intl.NumberFormat("ru-RU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);

    const [whole, decimal] = formatted.split(",");

    return { whole, decimal: decimal ?? "00" };
}

function getCategoryLabel(category?: string): string {
    if (!category) {
        return "Категория";
    }

    const categoryMap: Record<string, string> = {
        beauty: "Красота",
        fragrances: "Ароматы",
        furniture: "Мебель",
        groceries: "Продукты",
        smartphones: "Телефоны",
        laptops: "Ноутбуки",
        "mens-shirts": "Одежда",
        "mens-shoes": "Обувь",
        tops: "Одежда",
        "home-decoration": "Дом",
        "kitchen-accessories": "Аксессуары",
    };

    return categoryMap[category] ?? category;
}

export function ProductsTable({
                                  products,
                                  sort,
                                  onSort,
                                  selectedIds,
                                  allSelected,
                                  onToggleSelect,
                                  onToggleSelectAll,
                              }: Props) {
    const getSortMark = (field: SortField) => {
        if (sort.field !== field) return "";
        return sort.order === "asc" ? " ↑" : " ↓";
    };

    return (
        <div className="overflow-hidden rounded-xl">
            <div className="flex h-20 items-center border-b border-[#e5e7eb] px-4">
                <div className="flex w-[420px] items-center gap-5">
                    <button
                        type="button"
                        onClick={onToggleSelectAll}
                        className={`h-5 w-5 rounded border ${
                            allSelected
                                ? "border-slate-600 bg-slate-600"
                                : "border-[#a1a1aa] bg-white"
                        }`}
                    />

                    <button
                        type="button"
                        onClick={() => onSort("title")}
                        className="text-left text-base font-bold text-[#a1a1aa]"
                    >
                        Наименование{getSortMark("title")}
                    </button>
                </div>

                <div className="grid flex-1 grid-cols-[180px_180px_180px_180px_120px] items-center gap-8">
                    <button
                        type="button"
                        onClick={() => onSort("brand")}
                        className="text-center text-base font-bold text-[#a1a1aa]"
                    >
                        Вендор{getSortMark("brand")}
                    </button>

                    <button
                        type="button"
                        onClick={() => onSort("sku")}
                        className="text-center text-base font-bold text-[#a1a1aa]"
                    >
                        Артикул{getSortMark("sku")}
                    </button>

                    <button
                        type="button"
                        onClick={() => onSort("rating")}
                        className="text-center text-base font-bold text-[#a1a1aa]"
                    >
                        Оценка{getSortMark("rating")}
                    </button>

                    <button
                        type="button"
                        onClick={() => onSort("price")}
                        className="text-center text-base font-bold text-[#a1a1aa]"
                    >
                        Цена, ₽{getSortMark("price")}
                    </button>

                    <div />
                </div>
            </div>

            <div className="flex flex-col">
                {products.map((product) => {
                    const price = formatPrice(product.price);
                    const isSelected = selectedIds.includes(product.id);

                    return (
                        <div
                            key={product.id}
                            className="relative flex min-h-16 items-center border-b border-[#e5e7eb] px-4"
                        >
                            {isSelected && (
                                <div className="absolute left-0 top-0 h-full w-[3px] bg-slate-600" />
                            )}

                            <div className="flex w-[420px] items-center gap-4 py-3">
                                <button
                                    type="button"
                                    onClick={() => onToggleSelect(product.id)}
                                    className={`h-5 w-5 rounded border ${
                                        isSelected
                                            ? "border-slate-600 bg-slate-600"
                                            : "border-[#a1a1aa] bg-white"
                                    }`}
                                />

                                <div className="h-12 w-12 rounded-lg border border-[#e5e7eb] bg-[#c4c4c4]" />

                                <div className="min-w-0 max-w-[220px]">
                                    <div
                                        title={product.title}
                                        className="truncate text-base font-bold text-[#18181b]"
                                    >
                                        {product.title}
                                    </div>
                                    <div className="mt-1 text-sm text-[#a1a1aa]">
                                        {getCategoryLabel(product.category)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid flex-1 grid-cols-[180px_180px_180px_180px_120px] items-center gap-8">
                                <div className="text-center text-base font-bold text-black">
                                    {product.brand}
                                </div>

                                <div className="text-center text-base text-black">
                                    {product.sku}
                                </div>

                                <div className="text-center text-base">
                                    {product.rating < 3 ? (
                                        <>
                      <span className="text-red-600">
                        {product.rating.toFixed(1)}
                      </span>
                                            <span className="text-black">/5</span>
                                        </>
                                    ) : (
                                        <span className="text-black">
                      {product.rating.toFixed(1)}/5
                    </span>
                                    )}
                                </div>

                                <div className="text-center font-mono text-base">
                                    <span className="text-[#2b2b2f]">{price.whole}</span>
                                    <span className="text-[#a1a1aa]">,{price.decimal}</span>
                                </div>

                                <div className="flex items-center justify-center gap-8">
                                    <button
                                        type="button"
                                        className="flex h-7 w-12 items-center justify-center rounded-3xl bg-[#2d43e8] text-white transition hover:bg-[#2438d6]"
                                    >
                                        <Plus size={18} />
                                    </button>

                                    <button
                                        type="button"
                                        className="text-[#a1a1aa] transition hover:text-[#52525b]"
                                    >
                                        <MoreHorizontal size={22} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {products.length === 0 && (
                    <div className="py-10 text-center text-[#a1a1aa]">
                        Ничего не найдено
                    </div>
                )}
            </div>
        </div>
    );
}