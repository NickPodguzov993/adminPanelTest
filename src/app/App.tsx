import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./router";

export default function App() {
    return (
        <>
            <div style={{ padding: 8, fontSize: 12 }}>DEPLOY TEST v2</div>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
        </>
    );
}