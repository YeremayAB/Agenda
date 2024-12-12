import { useState } from "react";
import { login } from "../services/loginService";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            await login(username, password);
            alert("Login exitoso");
            window.location.href = "/dashboard";
        } catch  {
            setError("Credenciales inválidas");
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, error };
};

export default useLogin;
