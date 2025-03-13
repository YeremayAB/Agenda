import axios from "axios";

// URL base del backend
const API_BASE_URL = "http://localhost:3000/api/auth"; 

// Definir la estructura de usuario según la API
export interface User {
  id: string;
  displayName: string;
  mail?: string | null;
  userPrincipalName: string;
  jobTitle?: string | null;
}

// Función para obtener todos los usuarios desde el backend
export const getUsers = async (): Promise<User[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró el token de autenticación");

    const response = await axios.get<{ value: User[] }>(`${API_BASE_URL}/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.value; // Microsoft Graph API devuelve los datos en "value"
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    throw error;
  }
};
