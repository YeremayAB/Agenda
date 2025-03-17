/*import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
    const { instance } = useMsal();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                console.log("Procesando callback de autenticación...");
                const response = await instance.handleRedirectPromise();
    
                if (!response) {
                    console.error("No response from handleRedirectPromise");
                    navigate('/');
                    return;
                }
    
                console.log("Respuesta de MSAL:", response);
                const token = response.accessToken;
    
                if (!token) {
                    console.error("No se obtuvo un access token.");
                    navigate('/');
                    return;
                }
    
                console.log("Token recibido:", token);
                
                const backendResponse = await fetch('http://localhost:3000/auth/validate-microsoft/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });
    
                if (!backendResponse.ok) {
                    throw new Error(`Error en la autenticación: ${backendResponse.status}`);
                }
    
                const result = await backendResponse.json();
                console.log("Respuesta del backend:", result);
    
                if (result.status === 'ok' && result.user) {
                    localStorage.setItem('user', JSON.stringify(result.user));
                    localStorage.setItem('token', token);
                    
                    // Si no hay redirección personalizada, forzamos a /dashboard
                    navigate(result.redirect_url || '/dashboard');
                } else {
                    console.error('Error de autenticación. Verifica tus credenciales.');
                    navigate('/');
                }
            } catch (error) {
                console.error("Error en el callback:", error);
                navigate('/');
            }
        };
    
        handleCallback();
    }, [instance, navigate]);
    

    return <div>Procesando autenticación...</div>;
};

export default AuthCallback;
*/