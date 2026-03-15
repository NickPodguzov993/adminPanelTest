const BASE_URL = "https://dummyjson.com";

type RequestOptions = RequestInit & {
    token?: string | null;
};

export async function apiClient<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { token, headers, ...rest } = options;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || "Request failed");
    }

    return data as T;
}