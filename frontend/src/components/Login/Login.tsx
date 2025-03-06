// import React, { useState } from "react";

// import { Button } from "primereact/button";
// import { Card } from "primereact/card";
// import axios from "axios";

// const Login: React.FC = () => {
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);

//     const onSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setErrorMessage(null);
//         try {
//         } catch (err: unknown) {
//             if (axios.isAxiosError(err) && err.response?.status === 401) {
//                 setErrorMessage("Usuario o contraseña incorrectos");
//             } else {
//                 setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
//             }
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <Card className="className=shadow-lg w-[500px] p-6 rounded-md" >
//                 <h2 className="text-center text-xl font-bold mb-6">Iniciar Sesión</h2>
//                 {errorMessage && (
//                     <p className="text-red-500 text-center mb-4">{errorMessage}</p>
//                 )}
//                 <form onSubmit={onSubmit} className="space-y-5">
//                     {/* Campo de Usuario */}
//                     <div>
//                         <h1>Bienvenido</h1>
//                     </div>
//                     {/* Botón de Iniciar Sesión */}
//                     <Button
//                         type="button"
//                         // onClick={handleLogin} 
//                         className="w-full bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-4"
//                     />
//                 </form>
//             </Card>
//         </div>
//     );
// };

// export default Login;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import useAuth from "./hooks/useAuth";
import { Button } from "primereact/button";
import Header from "../HeaderAgenda";

const Login: React.FC = () => {
    const { user, handleSilentLogin } = useAuth();
    const navigate = useNavigate(); 

    useEffect(() => {
        const checkLogin = async () => {
            await handleSilentLogin();
            if (user) {
                navigate("/dashboard");
            }
        };
        checkLogin();
    }, [user, navigate]);

    return (
        <div>
            <Header
            sectionName="Agenda"
            logoSrc="/path/to/logo.png" 
            userName="John Doe"
            // onLogoutClick={handleLogout}
          />
        <div className="flex items-center justify-center min-h-screen">
            <Button 
                label="Iniciar sesión con Microsoft" 
                onClick={handleSilentLogin} 
                className="w-full bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:bg-green-600"
            />
        </div>

        </div>
    );
};

export default Login;

