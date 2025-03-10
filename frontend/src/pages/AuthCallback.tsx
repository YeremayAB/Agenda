import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const AuthCallback: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Este método maneja el proceso de redirección de MSAL
        const response = await instance.handleRedirectPromise();

        if (response) {
          // Si la autenticación es exitosa, redirige al Dashboard
          localStorage.setItem("token", response.accessToken);
          navigate("/dashboard");
        } else {
          // Si no hay respuesta, redirige al login
          navigate("/");
        }
      } catch (error) {
        console.error("Error en el callback:", error);
        navigate("/");
      }
    };

    handleRedirect();
  }, [instance, navigate]);

  return <div>Redirigiendo...</div>;
};

export default AuthCallback;
