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

export const getUsers = async (): Promise<{ users: User[] }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró el token de autenticación");

    const response = await axios.get<{ users: User[] }>(
      `${API_BASE_URL}/users/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Respuesta de la API:", response.data); // Debug

    return response.data; // Asegurarse de que devuelve { users: [...] }
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    throw error;
  }
};