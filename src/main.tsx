import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { AppQueryProvider } from "./app/providers/QueryProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AppQueryProvider>
            <App />
        </AppQueryProvider>
    </React.StrictMode>
);