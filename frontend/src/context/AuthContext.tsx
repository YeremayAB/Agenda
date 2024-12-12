import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { login as loginService, logout as logoutService } from "../components/Login/services/loginService";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Indicador de carga inicial

    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem("access_token");
            const refreshToken = localStorage.getItem("refresh_token");

            if (!refreshToken) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                if (!accessToken) {
                    // Si no hay token de acceso, intenta renovarlo
                    const response = await axios.post("http://localhost:8000/api/token/refresh/", {
                        refresh: refreshToken,
                    });
                    localStorage.setItem("access_token", response.data.access);
                    setIsAuthenticated(true);
                } else {
                    // Si hay un token de acceso, asume que es válido
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Error al renovar el token:", error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            await loginService(username, password);
            setIsAuthenticated(true);
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            throw err;
        }
    };

    const logout = () => {
        logoutService();
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return <div>Cargando...</div>; // Mostrar indicador de carga mientras se inicializa la autenticación
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
