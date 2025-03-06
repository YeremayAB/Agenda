import { useState } from "react";
import { login} from "../services/loginService"; 
// import axios from "axios"; 

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
        } catch {
            setError("Credenciales inválidas");
        } finally {
            setLoading(false);
        }
    };

    // const handleMicrosoftLogin = async (code: string) => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const response = await microsoftLogin(code);

    //         if (response.access_token) {
    //             alert("Login exitoso con Microsoft");
    //             window.location.href = "/dashboard";
    //         } else {
    //             setError("Error en el login con Microsoft");
    //         }
    //     } catch (error) {
    //         setError("Ocurrió un error con el login de Microsoft");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return { handleLogin, loading, error };
};

export default useLogin;
