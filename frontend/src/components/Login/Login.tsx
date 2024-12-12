import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
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
        
            
                <Card className="p-6 shadow-lg rounded-m px-6">
                    <h2 className="text-center text-xl font-bold mb-6">Iniciar Sesión</h2>
                    {errorMessage && (
                        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                    )}
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block mb-2">
                                Usuario
                            </label>
                            <InputText
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                feedback={false}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            label={loading ? "Cargando..." : "Iniciar Sesión"}
                            className="w-full p-button-primary"
                            disabled={loading}
                        />
                    </form>
                </Card>
        
       
    );
};

export default Login;
