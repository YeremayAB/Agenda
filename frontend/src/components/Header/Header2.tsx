import React, { useState, useEffect } from 'react';
import { Avatar } from 'primereact/avatar'; // Importar Avatar de PrimeReact
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/header.css';

const Header2: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el usuario desde localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Guardar datos básicos del usuario

      // Obtener foto de perfil si no está disponible
      fetchProfilePicture(parsedUser);
    } else {
      setLoading(false);
    }
  }, []);

  // Función para obtener la foto de perfil desde Microsoft Graph
  const fetchProfilePicture = async (user: any) => {
    const graphToken = localStorage.getItem('ms_token');
    if (!graphToken) {
      console.warn('⚠️ No se encontró el token de Microsoft Graph.');
      setLoading(false);
      return;
    }

    try {
      // Intentamos obtener la foto de perfil desde Microsoft Graph
      const response = await axios.get(
        `https://graph.microsoft.com/v1.0/users/${user.mail}/photo/$value`,
        {
          headers: {
            Authorization: `Bearer ${graphToken}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );

      if (response.status === 200) {
        const imageUrl = URL.createObjectURL(response.data);
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.warn('⚠️ No se pudo obtener la foto de perfil desde Microsoft Graph.');
    } finally {
      setLoading(false);
    }
  };

  // Función para renderizar la imagen de perfil o las iniciales
  const renderProfilePicture = () => {
    if (loading) {
      return (
        <Avatar
          icon="pi pi-spin pi-spinner"
          shape="circle"
          className="w-10 h-10 bg-gray-300 text-white"
        />
      );
    }

    if (profileImage) {
      return (
        <Avatar
          image={profileImage}
          shape="circle"
          className="w-10 h-10"
        />
      );
    } else if (user?.displayName) {
      const initials = user.displayName
        .split(' ')
        .map((word: string) => word.charAt(0))
        .join('');

      return (
        <Avatar
          label={initials}
          shape="circle"
          className="w-10 h-10 bg-gray-300 text-white"
        />
      );
    } else {
      return (
        <Avatar
          label="?"
          shape="circle"
          className="w-10 h-10 bg-gray-300 text-white"
        />
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('ms_token');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Sección izquierda: Título */}
        <h1 className="header-title">Agenda</h1>

        {/* Sección central: Logo */}
        <div className="header-logo">
          <img src="GrumasaLogo2.png" alt="Livvo Logo" className="logo-image" />
        </div>

        <div className="header-user">
          <div className="user-avatar-header">{renderProfilePicture()}</div>

          <span className="logout-text" onClick={handleLogout}>
            Cerrar sesión
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header2;
