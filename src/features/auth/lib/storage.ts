const ACCESS_TOKEN_KEY = "accessToken";

export function saveToken(token: string, remember: boolean) {
    clearToken();

    if (remember) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
}

export function getToken(): string | null {
    return (
        localStorage.getItem(ACCESS_TOKEN_KEY) ||
        sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
}

export function clearToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function isRememberedSession(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
}