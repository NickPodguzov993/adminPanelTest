import { z } from "zod";

export const addProductSchema = z.object({
    title: z.string().min(1, "Введите наименование"),
    price: z.number().min(0.01, "Цена должна быть больше 0"),
    brand: z.string().min(1, "Введите вендора"),
    sku: z.string().min(1, "Введите артикул"),
});

export type AddProductFormValues = z.infer<typeof addProductSchema>;