import { PrimeReactProvider } from 'primereact/api';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <PrimeReactProvider>
        <AuthProvider>
            <App />
    
        </AuthProvider>
        </PrimeReactProvider>
    </React.StrictMode>
);