import React, { useState } from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import "../assets/styles/UserProfile.css";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Elige el tema que prefieras
import "primereact/resources/primereact.min.css"; // Estilos de los componentes
import "primeicons/primeicons.css"; // Estilos de los iconos
import { Dialog } from "primereact/dialog";
import Header2 from "../components/Header/Header2";

interface UserProfileProps {
  name: string;
  position: string;
  email: string;
  phone: string;
  mobile?: string;
  department: string;
  office: string;
  profilePicture?: string; // Nueva propiedad para la foto de perfil
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  position,
  email,
  phone,
  mobile,
  department,
  office,
  profilePicture,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Header2 />
      {/* Botón de regreso con PrimeReact */}
      <Button
        icon="pi pi-arrow-left"
        className="back-button"
        onClick={() => window.history.back()}
      />
      <div className="user-profile">
        <h2 className="user-title">
          {name} - <strong>{position.toUpperCase()}</strong>
        </h2>
         {/* Tarjeta que contiene la imagen y la info */}
         <Card className="user-card">
          <div className="user-content">
            {/* Avatar dentro de la tarjeta */}
            <Avatar
              image={profilePicture || "/default-avatar.jpg"}
              icon="pi pi-user"
              className="user-avatar"
              shape="circle"
              onClick={() => setVisible(true)}
              style={{ cursor: "pointer" }}
            />

            {/* Información del usuario */}
            <div className="user-info">
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Extensión:</strong></p>
              <p><strong>Teléfono:</strong> {phone}</p>
              <p><strong>Teléfono móvil:</strong> {mobile || "-"}</p>
              <p><strong>Posición:</strong> {position}</p>
              <p><strong>Departamento:</strong> {department}</p>
              <p><strong>Oficina:</strong> {office}</p>
            </div>
          </div>
        </Card>
        <Dialog
          visible={visible}
          onHide={() => setVisible(false)}
          header="Foto de perfil"
          className="profile-dialog"
          modal
          style={{ width: "50vw", textAlign: "center" }}
        >
          <img
            src={profilePicture || "/default-avatar.jpg"}
            alt="Perfil"
            className="profile-modal-img"
          />
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;
