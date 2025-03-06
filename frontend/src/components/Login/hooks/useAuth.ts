import { PublicClientApplication, AccountInfo, AuthenticationResult } from "@azure/msal-browser";
import { useState } from "react";

const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MICROSOFT_TENANT_ID}`,
        redirectUri: import.meta.env.VITE_REDIRECT_URI,
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

const useAuth = () => {
    const [user, setUser] = useState<AccountInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSilentLogin = async () => {
        try {
            const accounts = msalInstance.getAllAccounts();
            
            if (accounts.length === 0) {
                setError("No se encontró ninguna cuenta registrada en el navegador.");
                return;
            }

            const response: AuthenticationResult = await msalInstance.ssoSilent({
                scopes: ["openid", "profile", "email"],
                loginHint: accounts[0].username, 
            });

            if (response.account) {
                setUser(response.account);
                console.log("Inicio de sesión exitoso:", response.account);
            }
        } catch (error) {
            console.error("Error en el login silencioso:", error);
            setError("Hubo un error al intentar realizar el login silencioso.");
        }
    };

    return { user, error, handleSilentLogin };
};

export default useAuth;
