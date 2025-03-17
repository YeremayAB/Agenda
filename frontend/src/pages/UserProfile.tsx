import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import "../assets/styles/UserProfile.css";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Header2 from "../components/Header/Header2";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/users/${userId}/`
        );
        const data = await response.json();
        setUser(data);

        if (!data.profile_image) {
          fetchMicrosoftProfileImage(data.email);
        } else {
          setProfileImage(data.profile_image);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchMicrosoftProfileImage = async (email: string) => {
    if (!email) return;

    try {
      const graphToken = localStorage.getItem("ms_token");
      if (!graphToken) return;

      const response = await axios.get(
        `https://graph.microsoft.com/v1.0/users/${email}/photo/$value`,
        {
          headers: {
            Authorization: `Bearer ${graphToken}`,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const imageURL = URL.createObjectURL(response.data);
        setProfileImage(imageURL);
      }
    } catch (error) {
      console.error(`No se pudo obtener la imagen de ${email}:`, error);
    }
  };

  const renderProfilePicture = () => {
    if (profileImage) {
      return (
        <Avatar
          image={profileImage}
          className="user-avatar-profile"
          shape="circle"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      );
    } else {
      const name = user?.full_name || "";
      const initials = name
        .trim() 
        .split(/\s+/)
        .map((word: string) => word.charAt(0).toUpperCase()) 
        .join("");
      return (
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-300 text-white text-xl">
          {initials}
        </div>
      );
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div>
      <Header2 />
      <Button
        icon="pi pi-arrow-left"
        className="back-button"
        onClick={() => navigate(-1)}
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
        <Card className="user-card">
          <div className="user-content-profile">
            <div className="user-avatar-container-profile">
              {renderProfilePicture()}
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
