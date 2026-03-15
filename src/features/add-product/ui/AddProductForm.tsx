import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    addProductSchema,
    type AddProductFormValues,
} from "../model/addProduct.schema";

type Props = {
    onSubmit: (values: AddProductFormValues) => void;
};

export function AddProductForm({ onSubmit }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddProductFormValues>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            title: "",
            price: 0,
            brand: "",
            sku: "",
        },
    });

    const submitHandler = (values: AddProductFormValues) => {
        onSubmit(values);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div>
                <input
                    {...register("title")}
                    placeholder="Наименование"
                    className="w-full rounded-xl border px-4 py-3"
                />
                {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
            </div>

            <div>
                <input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    placeholder="Цена"
                    className="w-full rounded-xl border px-4 py-3"
                />
                {errors.price && (
                    <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
            </div>

            <div>
                <input
                    {...register("brand")}
                    placeholder="Вендор"
                    className="w-full rounded-xl border px-4 py-3"
                />
                {errors.brand && (
                    <p className="text-sm text-red-500">{errors.brand.message}</p>
                )}
            </div>

            <div>
                <input
                    {...register("sku")}
                    placeholder="Артикул"
                    className="w-full rounded-xl border px-4 py-3"
                />
                {errors.sku && (
                    <p className="text-sm text-red-500">{errors.sku.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full rounded-xl bg-black px-4 py-3 text-white"
            >
                Сохранить
            </button>
        </form>
    );
}