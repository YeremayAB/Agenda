import axios from "axios";

// URL base del backend para autenticación y gestión de usuarios.
const API_BASE_URL = "http://localhost:3000/api/auth";

/**
 * Interfaz que define la estructura de un usuario según la API.
 */
export interface User {
  id: string; // Identificador único del usuario
  displayName: string; // Nombre completo del usuario
  mail?: string | null; // Correo electrónico
  userPrincipalName: string; // Nombre de usuario principal (UPN)
  jobTitle?: string | null; // Cargo o puesto de trabajo
  profile_image?: string | null; // URL de la imagen de perfil
  full_name?: string | null; // Nombre completo alternativo
  phone?: string | null; // Número de teléfono fijo 
  mobilePhone?: string | null; // Número de teléfono móvil 
  department?: string | null; // Departamento del usuario 
  office?: string | null; // Oficina donde trabaja el usuario
  businessPhones?: string[] | null; // Lista de teléfonos de trabajo 
}

/**
 * Obtiene la lista de usuarios desde la API del backend.
 * @returns {Promise<{users : User}>} Un objeto que contiene un array de usuarios.
 * @throws Lanza un error si ocurre un problema con la autenticación o con la solicitud de la API.
 */
export const getUsers = async (): Promise<{ users: User[] }> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token almacenado:", token);

    if (!token) throw new Error("No se encontró el token de autenticación");

    //Petición GET a la API para obtener los usuarios
    const response = await axios.get<{ users: User[] }>(
      `${API_BASE_URL}/users/`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Token necesario para autenticarse en la API
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo usuarios:", error);
    throw error;
  }
};
