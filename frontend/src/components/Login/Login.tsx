// import React from "react";
// import { useMsal } from "@azure/msal-react";
// import { loginRequest } from "../Login/services/loginService";
// import "../../assets/styles/Login.css"
// // import { useNavigate } from "react-router-dom";
// // import { useEffect } from "react";

// const Login: React.FC = () => {
//   const { instance } = useMsal();
// //   const navigate = useNavigate();

//   // const handleLogin = async () => {
//   //     try {
//   //         const response = await instance.loginPopup(loginRequest);
//   //         const token = response.accessToken;

//   //         const backendResponse = await fetch('http://localhost:8000/api/auth/validate-microsoft/', {
//   //             method: 'POST',
//   //             headers: { 'Content-Type': 'application/json' },
//   //             body: JSON.stringify({ token })
//   //         });

//   //         const result = await backendResponse.json();

//   //         if (result.status === 'ok') {
//   //             localStorage.setItem('user', JSON.stringify(result.user));
//   //             localStorage.setItem('token', token);
//   //             navigate('/dashboard', { replace: true });
//   //         } else {
//   //             alert('Error de autenticación');
//   //         }
//   //     } catch (error) {
//   //         console.error("Error en login:", error);
//   //         alert('Error conectando con Microsoft');
//   //     }
//   // };

//   // Login.jsx (modificado)
//   const handleLogin = async () => {
//     try {
//       await instance.loginRedirect(loginRequest);
//     } catch (error) {
//       console.error("Error en login:", error);
//       alert("Error conectando con Microsoft");
//     }
//   };

// //   useEffect(() => {
// //     if (accounts.length > 0) {
// //       navigate("/dashboard", { replace: true });
// //     }
// //   }, [accounts, navigate]);

//   return (
//     <div className="login-page">
//       <h1>Bienvenido</h1>
//       <button onClick={handleLogin}>Login con Microsoft</button>
//     </div>
//   );
// };

// export default Login;

import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../Login/services/loginService";
import "../../assets/styles/Login.css";
import Header from "../Header/Header";

const Login: React.FC = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error conectando con Microsoft");
    }
  };

  return (
    <>
    <Header />
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Bienvenido</h1>
          <button onClick={handleLogin}>Login con Microsoft</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;

