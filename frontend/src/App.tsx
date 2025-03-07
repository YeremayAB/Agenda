import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { msalConfig } from "./authConfig"; // Tu archivo de configuración de MSAL
import "./App.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// Crear la instancia de PublicClientApplication
const msalInstance = new PublicClientApplication(msalConfig);

const App: React.FC = () => {
    return (
        <MsalProvider instance={msalInstance}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </MsalProvider>
    );
};

export default App;
