import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import "../assets/styles/UserProfile.css";
import Header from "../components/Header/Header";

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
    return (
        <div>
            <Header />
            <div className="user-profile">
                <h2 className="user-title">
                    {name} - <strong>{position.toUpperCase()}</strong>
                </h2>
                <Avatar 
                    image={profilePicture || "/default-avatar.png"} 
                    className="user-avatar" 
                    shape="circle" 
                    icon="pi pi-user"
                />
                <Card className="user-card">
                    <div className="user-info">
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Extensión:</strong></p>
                        <p><strong>Teléfono:</strong> {phone}</p>
                        <p><strong>Teléfono móvil:</strong> {mobile || ""}</p>
                        <p><strong>Posición:</strong> {position}</p>
                        <p><strong>Departamento:</strong> {department}</p>
                        <p><strong>Oficina:</strong> {office}</p>
                    </div>
                </Card>
                {/* <Button label="Editar" icon="pi pi-pencil" className="edit-button" /> */}
            </div>
        </div>
    );
};

export default UserProfile;