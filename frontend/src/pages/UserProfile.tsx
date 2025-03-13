import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import "../assets/styles/UserProfile.css";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Elige el tema que prefieras
import "primereact/resources/primereact.min.css"; // Estilos de los componentes
import "primeicons/primeicons.css";
import Header2 from "../components/Header/Header2";
import { useParams } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Obtén el ID desde la URL
  const [user, setUser] = useState<any>(null);

  // Solicitar datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/auth/users/${userId}`
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const renderProfilePicture = (user: any) => {
    if (user.profile_image) {
      // Si hay imagen de perfil, mostrarla
      return (
        <Avatar
          image={user.profile_image}
          className="user-avatar-profile"
          shape="circle"
          // style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
      );
    } else {
      // Si no hay imagen de perfil, mostrar las iniciales
      const name = user.full_name || "";
      const initials = name
        .split(" ")
        .map((word: string) => word.charAt(0))
        .join("");
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-white">
          {initials}
        </div>
      );
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div>
      <Header2 />
      {/* Botón de regreso */}
      <Button
        icon="pi pi-arrow-left"
        className="back-button"
        onClick={() => window.history.back()}
      />
      <div className="user-profile">
        <h2 className="user-title">
          {user.full_name} -{" "}
          <strong>
            {user.position
              ? user.position.toUpperCase()
              : "Posición no disponible"}
          </strong>
        </h2>
        {/* Tarjeta con los datos del usuario */}
        <Card className="user-card">
          <div className="user-content-profile">
            {/* Aquí llamamos a renderProfilePicture para mostrar la imagen o las iniciales */}
            <div className="user-avatar-container-profile">
              {renderProfilePicture(user)}
            </div>
            <div className="user-info">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {user.phone}
              </p>
              <p>
                <strong>Teléfono móvil:</strong> {user.mobile_phone}
              </p>
              <p>
                <strong>Posición:</strong> {user.position}
              </p>
              <p>
                <strong>Departamento:</strong> {user.department}
              </p>
              <p>
                <strong>Oficina:</strong> {user.office}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
