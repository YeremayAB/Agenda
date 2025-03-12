import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const { instance, inProgress } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const response = await instance.handleRedirectPromise();

        if (!response) {
          console.warn("No se recibió respuesta del login");
          navigate("/");
          return;
        }

        const token = response.accessToken;
        console.log("Token recibido:", token);

        const backendResponse = await fetch(
          "http://localhost:8000/api/validate-microsoft/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        if (!backendResponse.ok) {
          throw new Error("Error en la respuesta del backend");
        }

        const result = await backendResponse.json();

        if (result.status === "ok") {
          localStorage.setItem("user", JSON.stringify(result.user));
          localStorage.setItem("token", token);
          navigate("/dashboard", { replace: true });
        } else {
          console.error("Error de autenticación:", result.error);
          navigate("/");
        }
      } catch (error) {
        console.error("Error durante la autenticación:", error);
        navigate("/");
      }
    };

    if (inProgress === "none") {
      handleAuth();
    }
  }, [instance, inProgress, navigate]);

  return <p>Autenticando...</p>;
};

export default AuthCallback;
