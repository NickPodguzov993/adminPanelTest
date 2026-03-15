import { createHashRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../../pages/login/LoginPage";
import { ProductsPage } from "../../pages/products/ProductsPage";
import { ProtectedRoute } from "../../features/auth/ui/ProtectedRoute";

export const router = createHashRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                element: <ProductsPage />,
            },
            {
                path: "products",
                element: <ProductsPage />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);