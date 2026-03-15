import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
  remember: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;