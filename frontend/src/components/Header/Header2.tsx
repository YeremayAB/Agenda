import React, { useState, useEffect } from "react";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/styles/header.css";
import { User } from "../Login/services/UsersService";

/**
 * Componente del encabezado con la información del usuario.
 * - Obtiene los datos del usuario desde `localStorage`.
 * - Recupera la foto de perfil desde Microsoft Graph.
 * - Muestra las iniciales si no hay imagen de perfil disponible.
 */
const Header2: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Al montar el componente, obtiene el usuario desde `localStorage`
   * y, si es necesario, intenta recuperar su imagen de perfil.
   */
  useEffect(() => {
    // Obtener el usuario almacenado en el localStorage al montar el componente
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Si el usuario tiene un email, intentar cargar su foto de perfil desde Microsoft Graph
      fetchProfilePicture(parsedUser);
    } else {
      setLoading(false); //si no hay usuario almacenado, detener la carga
    }
  }, []);

  /**
   * Obtiene la foto de perfil del usuario desde Microsoft Graph API.
   * @param {any} user - Objeto del usuario obtenido desde el localStorage.
   */
  const fetchProfilePicture = async (user: any) => {
    const graphToken = localStorage.getItem("ms_token");
    if (!graphToken) {
      console.warn("⚠️ No se encontró el token de Microsoft Graph.");
      setLoading(false);
      return;
    }

    try {
      // Petición a Microsoft Graph API para obtener la foto de perfil del usuario
      const response = await axios.get(
        `https://graph.microsoft.com/v1.0/users/${user.mail}/photo/$value`,
        {
          headers: {
            Authorization: `Bearer ${graphToken}`,
            "Content-Type": "application/json",
          },
          responseType: "blob", //Recibir la imagen como blob
        }
      );

      if (response.status === 200) {
        //Convertir la respuesta en una URL válida para la imagen
        const imageUrl = URL.createObjectURL(response.data);
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.warn(
        "⚠️ No se pudo obtener la foto de perfil desde Microsoft Graph."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   *Renderiza la imagen de perfil del usuario
   *Si la imagen no está disponible, muestra las iniciales del nombre del usuario
   *Si no hay nombre, muestra un '?' por defecto
   *
   * @returns {JSX.Element} Avatar del usuario.
   */
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
      return <Avatar image={profileImage} shape="circle" className="w-10 h-10" />;
    } else if (user?.displayName) {
      const initials = user.displayName
        .split(" ")
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


  /**
   * Cierra la sesión del usuario.
   * Elimina los datos del usuario almacenados en localStorage y redirige a la página del Login.
   */
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("ms_token");
    navigate("/"); //Redirige a la pantalla del Login.
  };
  return (
    <header className="header">
      <div className="header-content">
        {/* Sección izquierda: Título */}
        <h1 className="header-title">Agenda</h1>

        {/* Sección central: Logo */}
        <div className="header-logo">
          <img
            src="/GrumasaLogoDef.png"
            alt="Grumasa Logo"
            className="logo-image"
          />
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
