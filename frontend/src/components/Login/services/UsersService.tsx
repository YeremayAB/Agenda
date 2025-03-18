import axios from "axios";

// URL base del backend para autenticación y gestión de usuarios.
const API_BASE_URL = "http://localhost:3000/api/auth";

/**
 * Estructura del usuario según la API.
 * Define los datos principales que se obtienen desde el backend.
 */
export interface User {
  isFavorite: unknown;
  id: string;
  displayName: string;
  mail?: string | null;
  userPrincipalName: string;
  jobTitle?: string | null;
  profile_image?: string | null;
  full_name?: string | null;
  phone?: string | null;
  mobilePhone?: string | null;
  department?: string | null;
  office?: string | null;
  businessPhones?: string[] | null;
}

/**
 * Obtiene la lista de usuarios desde el backend.
 *
 * **Salida:**
 * - Devuelve un objeto con la propiedad `users`, que es un array de `User`.
 * - Lanza un error si la petición falla.
 *
 * **Notas:**
 * - Requiere un token de autenticación almacenado en `localStorage`.
 * - Si el token no está disponible, lanza un error.
 */
export const getUsers = async (): Promise<{ users: User[] }> => {
  try {
    // 🔹 Obtener el token almacenado en localStorage
    const token = localStorage.getItem('token');
    console.log('🔑 Token almacenado:', token); // 🛠 Debug

    if (!token) throw new Error("No se encontró el token de autenticación");

    // 🔹 Llamada a la API para obtener los usuarios
    const response = await axios.get<{ users: User[] }>(
      `${API_BASE_URL}/users/`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Token necesario para autenticarse en la API
          "Content-Type": "application/json",
        },
      }
    );

    console.log('📡 Respuesta de la API:', response.data); // 🛠 Debug
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo usuarios:", error);
    throw error;
  }
};
