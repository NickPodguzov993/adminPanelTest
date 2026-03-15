import { createHashRouter } from "react-router-dom";
import { LoginPage } from "../../pages/login/LoginPage";
import { ProductsPage } from "../../pages/products/ProductsPage";
import { ProtectedRoute } from "../../features/auth/ui/ProtectedRoute";

export const router = createHashRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <ProductsPage />,
            },
            {
                path: "/products",
                element: <ProductsPage />,
            },
        ],
    },
]);