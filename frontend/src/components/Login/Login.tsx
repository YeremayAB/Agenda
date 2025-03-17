import React, { useRef } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../Login/services/loginService';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import Header from '../Header/Header';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import '../../assets/styles/Login.css';

const Login: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const showError = (message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      if (!response || !response.accessToken) {
        throw new Error('No se obtuvo un token válido de Microsoft.');
      }

      const msToken = response.accessToken;
      console.log('🔑 Token de Microsoft Graph recibido:', msToken); // ✅ Agregamos este log

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
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.access); // 🔹 Token del backend
        localStorage.setItem('ms_token', msToken); // 🔹 Token de Microsoft Graph
        localStorage.setItem('refresh', result.refresh);
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