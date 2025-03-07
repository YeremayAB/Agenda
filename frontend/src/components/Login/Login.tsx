import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import axios from "axios";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import "../../assets/styles/login.css";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null); // Limpiar errores anteriores

    try {
      // Intentar login silencioso
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts.length > 0 ? accounts[0] : undefined, // Usar la cuenta activa si está disponible
      });

      // Si se obtiene un token de acceso, autenticamos con el backend
      if (response.accessToken) {
        await authenticateWithBackend(response.accessToken);
      } else {
        throw new Error("No se recibió un token de acceso válido.");
      }
    } catch (err) {
      console.error("Error en el inicio de sesión silencioso:", err);
      // Aquí no mostramos el popup ni intentamos iniciar sesión de nuevo
      setError("No se pudo iniciar sesión. Por favor, verifica tu sesión.");
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithBackend = async (accessToken: string) => {
    try {
      const backendResponse = await axios.post("/api/auth/microsoft/", {
        access_token: accessToken,
      });
      console.log("Usuario autenticado:", backendResponse.data);
      // Redirige al dashboard si la autenticación es exitosa
      navigate("/dashboard");
    } catch (err) {
      console.error("Error al autenticar con el backend:", err);
      setError("Error al validar las credenciales en el backend.");
    }
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <Card className="login-card" title="Bienvenido a la aplicación de agenda">
          {error && <p className="error-message">{error}</p>} {/* Mostrar errores si existen */}
          <p>Por favor, inicia sesión con tu cuenta de Microsoft.</p>
          {loading ? (
            <span>Cargando...</span>
          ) : (
            <Button
              label="Iniciar Sesión con Microsoft"
              className="login-button"
              onClick={handleLogin}
              disabled={loading}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;
