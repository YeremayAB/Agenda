// import React, { useEffect } from "react";
// import { useMsal } from "@azure/msal-react";
// import { useNavigate } from "react-router-dom";

// const AuthCallback = () => {
//   const { instance, inProgress } = useMsal();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleAuth = async () => {
//       try {
//         if (inProgress !== "none") return; // Evitar que se ejecute si ya hay un proceso de autenticación en curso.
    
//         let account = instance.getActiveAccount();
//         let token = null;
    
//         // Si no hay cuenta activa, intentamos manejar la redirección
//         if (!account) {
//           const response = await instance.handleRedirectPromise();
//           if (response && response.account) {
//             account = response.account;
//             instance.setActiveAccount(account);
//             token = response.accessToken;
//           }
//         }
    
//         // Si ya hay cuenta activa, intentamos obtener el token silenciosamente
//         if (!token && account) {
//           const tokenResponse = await instance.acquireTokenSilent({
//             scopes: ["User.Read"],
//             account
//           });
//           token = tokenResponse.accessToken;
//         }
    
//         // Aquí es donde agregas el console.log para verificar el token
//         console.log("Token enviado al backend:", token); // Debug: verifica el token que se enviará
    
//         // Si se obtiene el token, lo enviamos al backend
//         if (token) {
//           const backendResponse = await fetch("http://localhost:8000/api/auth/validate-microsoft/", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ token })
//           });
    
//           const result = await backendResponse.json();
    
//           if (backendResponse.ok && result.status === "ok") {
//             localStorage.setItem("user", JSON.stringify(result.user));
//             localStorage.setItem("token", token);
//             navigate("/dashboard", { replace: true });
//           } else {
//             console.error("Error de validación:", result);
//             navigate("/");  // Redirige al home en caso de error
//           }
//         } else {
//           console.error("No se obtuvo token");
//           navigate("/"); // Si no se obtiene el token, redirige al home.
//         }
//       } catch (error) {
//         console.error("Error en la autenticación:", error);
//         navigate("/"); // En caso de error, redirige al home.
//       }
//     };
    

//     handleAuth();
//   }, [instance, inProgress, navigate]);

//   return <p>Autenticando...</p>;
// };

// export default AuthCallback;
