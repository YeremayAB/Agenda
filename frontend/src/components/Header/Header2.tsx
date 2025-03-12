import { useNavigate } from "react-router-dom"; // Para redirigir al perfil y al logout
import "../../assets/styles/header.css";
import { Avatar } from "primereact/avatar";

const Header2 = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("token"); // Eliminar el token si se usa
      navigate("/login"); // Redirigir a la página de login
    } catch (error) {
      console.error("Error cerrando sesión", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/perfil"); // Redirige a la página del perfil del usuario
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Sección izquierda: Título */}
        <h1 className="header-title">Agenda</h1>

        {/* Sección central: Logo */}
        <div className="header-logo">
          <img src="GrumasaLogo3.png" alt="Livvo Logo" className="logo-image" />
        </div>

        {/* Sección derecha: Avatar y Cerrar sesión */}
        <div className="header-user">
          <Avatar 
            image="/default-avatar2.jpg" 
            shape="circle" 
            className="user-avatar1"
            onClick={handleProfileClick} // Redirige al perfil
            style={{ cursor: "pointer" }} // Hace clickeable el avatar
          />
          <span className="logout-text" onClick={handleLogout}>Cerrar sesión</span>
        </div>
      </div>
    </header>
  ); 
};

export default Header2;
