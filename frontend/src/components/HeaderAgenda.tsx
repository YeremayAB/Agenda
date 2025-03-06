import React from "react";
import logo from "../../public/logo.png";

interface HeaderProps {
  sectionName: string; 
  logoSrc: string; 
  userName: string; 
  onLogoutClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  sectionName,
  userName,
}) => {
  return (
    <header className="bg-customGreen text-white p-6 flex items-center justify-between rounded-b-[20px]">
      <div className="text-2xl font-bold pl-4">
        {sectionName}
      </div>
      <div className="flex-1 text-center">
        <img
          src={logo}
          alt="Logo"
          className="w-30 h-20 inline-block align-middle"
        />
      </div>
      <div className="flex flex-col items-end pr-4"> 
        <span className="text-sm mb-1">Bienvenido, {userName}</span>
        <button
        //   onClick={onLogoutClick}
          className="text-lg font-semibold transition duration-300"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;