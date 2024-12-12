import React, { useState } from "react";
import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import axios from "axios";
import useLogin from "./hooks/useLogin";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { handleLogin, loading } = useLogin();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        try {
            await handleLogin(username, password);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setErrorMessage("Usuario o contraseña incorrectos");
            } else {
                setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="className=shadow-lg w-[500px] p-6 rounded-md" >
                <h2 className="text-center text-xl font-bold mb-6">Iniciar Sesión</h2>
                {errorMessage && (
                    <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                )}
                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Campo de Usuario */}
                    <div>
                        <label htmlFor="username" className="block mb-2 font-medium">
                            Usuario
                        </label>
                        <InputText
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Usuario"
                        />
                    </div>
                    {/* Campo de Contraseña */}
                    <div>
                        <label htmlFor="password" className="block mb-2 font-medium">
                            Contraseña
                        </label>
                        <InputText
                            type="password" // Cambiar el tipo a contraseña
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contraseña"
                        />
                    </div>
                    {/* Botón de Iniciar Sesión */}
                    <Button
                        type="submit"
                        label={loading ? "Cargando..." : "Iniciar Sesión"}
                        className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    />
                </form>
            </Card>
        </div>
    );
};

export default Login;
