
import type { LoginResponse } from "../model/auth.types";
import {apiClient} from "../../shared/api/client.ts";

type LoginPayload = {
    username: string;
    password: string;
};

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
    return apiClient<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}