export type LoginRequest = {
    username: string;
    password: string;
    remember: boolean;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken?: string;
    id: number;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
};