import React, { useState, useEffect } from "react";
import "../../assets/styles/header.css";
import { Avatar } from "primereact/avatar"; // Importar Avatar de PrimeReact

const Header2 = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Obtener el ID del usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;

      // Realizar una solicitud para obtener los datos completos del usuario
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/auth/users/${userId}`
          );
          const data = await response.json();
          setUser(data); // Guardar los datos del usuario
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        } finally {
          setLoading(false); // Finalizar el estado de carga
        }
      };

      fetchUserData();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error cerrando sesión", error);
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

    if (user?.profile_image) {
      return (
        <Avatar
          image={user.profile_image}
          shape="circle"
          className="w-10 h-10"
        />
      );
    } else {
      const name = user?.full_name || "";
      const initials = name
        .split(" ")
        .map((word: string) => word.charAt(0))
        .join("");

      return (
        <Avatar
          label={initials}
          shape="circle"
          className="w-10 h-10 bg-gray-300 text-white"
        />
      );
    }
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

        {/* Sección derecha: Avatar y Cerrar sesión */}
        <div className="header-user">
          {/* Mostrar la imagen del usuario o las iniciales */}
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