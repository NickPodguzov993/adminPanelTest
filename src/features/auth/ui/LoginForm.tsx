import { useState } from "react";
import { Eye, EyeOff, Lock, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginRequest } from "../api/authApi";
import { useAuthStore } from "../model/useAuthStore";
import { loginSchema, type LoginFormValues } from "../model/login.schema";
import logo from "../../../assets/images/logo.svg";

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
            remember: false,
        },
    });

    const usernameValue = watch("username");

    const onSubmit = async (values: LoginFormValues) => {
        try {
            setServerError("");

            const data = await loginRequest({
                username: values.username,
                password: values.password,
            });

            setAuth(data.accessToken, values.remember);
            navigate("/products");
        } catch (error) {
            setServerError(
                error instanceof Error ? error.message : "Ошибка авторизации"
            );
        }
    };

    return (
        <div className="w-full max-w-[420px] rounded-3xl bg-white p-10 shadow-xl">
            <div className="mb-6 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 shadow-inner">
                    <div className=" rounded-sm " ><img src={logo}
                                                               alt="Logo"
                                                               /></div>
                </div>
            </div>

            <h1 className="text-center text-3xl font-bold text-[#2b2b2f]">
                Добро пожаловать!
            </h1>

            <p className="mt-2 text-center text-[#a1a1aa]">
                Пожалуйста, авторизируйтесь
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
                <div>
                    <label className="mb-2 block text-sm font-medium text-[#2b2b2f]">
                        Логин
                    </label>

                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-[#f9f9f9] px-4 py-3">
                        <User size={18} className="text-gray-400" />

                        <input
                            {...register("username")}
                            placeholder="Введите логин"
                            className="w-full bg-transparent outline-none"
                        />

                        {usernameValue && (
                            <button
                                type="button"
                                onClick={() => setValue("username", "")}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {errors.username && (
                        <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[#2b2b2f]">
                        Пароль
                    </label>

                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-[#f9f9f9] px-4 py-3">
                        <Lock size={18} className="text-gray-400" />

                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Введите пароль"
                            className="w-full bg-transparent outline-none"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-gray-400 transition hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff size={18} className="text-gray-400" />
                            ) : (
                                <Eye size={18} className="text-gray-400" />
                            )}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                    )}

                    {serverError && (
                        <p className="mt-1 text-sm text-red-500">{serverError}</p>
                    )}
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-500">
                    <input type="checkbox" {...register("remember")} />
                    Запомнить данные
                </label>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 h-12 rounded-lg bg-gradient-to-r from-[#4f46e5] to-[#4338ca] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSubmitting ? "Вход..." : "Войти"}
                </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-sm text-gray-400">
                <div className="h-[1px] flex-1 bg-gray-200" />
                или
                <div className="h-[1px] flex-1 bg-gray-200" />
            </div>

            <p className="text-center text-sm text-gray-500">
                Нет аккаунта?{" "}
                <button
                    type="button"
                    className="font-semibold text-indigo-600 hover:underline"
                >
                    Создать
                </button>
            </p>
        </div>
    );
}