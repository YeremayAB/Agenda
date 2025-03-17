import React, { useRef } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../Login/services/loginService';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import Header from '../Header/Header';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import '../../assets/styles/Login.css';

/**
 * Componente de inicio de sesión con Microsoft.
 * Utiliza MSAL para autenticarse con Microsoft y luego valida el token con el backend.
 *
 * **Funciones principales:**
 * - `handleLogin`: Realiza el proceso de autenticación con Microsoft y envía el token al backend.
 * - `showError`: Muestra un mensaje de error en un toast.
 */

const Login: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  /**
   * Muestra un mensaje de error en pantalla.
   *
   * **Parámetros:**
   * - `message` (string): Mensaje de error a mostrar.
   */
  const showError = (message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    });
  };

  /**
   * Maneja el inicio de sesión con Microsoft.
   *
   * **Proceso:**
   * 1. Solicita autenticación mediante `loginPopup()`.
   * 2. Obtiene un token de Microsoft Graph.
   * 3. Envía el token al backend para validación.
   * 4. Si la validación es exitosa, almacena los datos y redirige al usuario.
   *
   * **Errores manejados:**
   * - Si no se obtiene un token válido de Microsoft.
   * - Si la autenticación con el backend falla.
   */
  const handleLogin = async () => {
    try {
      // Solicita autenticación con Microsoft
      const response = await instance.loginPopup(loginRequest);
      if (!response || !response.accessToken) {
        throw new Error('No se obtuvo un token válido de Microsoft.');
      }

      const msToken = response.accessToken;
      console.log('🔑 Token de Microsoft Graph recibido:', msToken);

      // Enviar token al backend para validación
      const backendResponse = await fetch(
        'http://localhost:3000/api/auth/validate-microsoft/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ msToken }),
        }
      );

      if (!backendResponse.ok) {
        throw new Error(`Error en la autenticación: ${backendResponse.status}`);
      }

      const result = await backendResponse.json();

      if (result.status === 'ok' && result.access) {
        // Guardar datos en localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.access); // Token del backend
        localStorage.setItem('ms_token', msToken); // Token de Microsoft Graph
        localStorage.setItem('refresh', result.refresh);

        // Redirigir al usuario
        navigate('/dashboard');
      } else {
        showError('Error de autenticación. Verifica tus credenciales.');
      }
    } catch (error) {
      console.error('Error en login:', error);
      showError('Error conectando con Microsoft. Inténtalo de nuevo.');
    }
  };


  return (
    <div className='login-page'>
      <Header />
      <Toast ref={toast} />
      <div className='login-container'>
        <Card
          className='login-card'
          title='Bienvenido a la aplicación de agenda'
        >
          <p>Por favor, inicia sesión con tu cuenta de Microsoft.</p>
          <Button
            label='Iniciar Sesión con Microsoft'
            className='login-button'
            onClick={handleLogin}
          />
        </Card>
      </div>
    </div>
  );
};
 
export default Login;