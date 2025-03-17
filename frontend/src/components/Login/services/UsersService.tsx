import axios from 'axios';

// URL base del backend
const API_BASE_URL = 'http://localhost:3000/api/auth';

// Definir la estructura de usuario según la API
export interface User {
  id: string;
  displayName: string;
  mail?: string | null;
  userPrincipalName: string;
  jobTitle?: string | null;
  profile_image?: string | null;
  full_name?: string | null;
  phone?: string | null;
  mobile_phone?: string | null;
  department?: string | null;
  office?: string | null;
}

export const getUsers = async (): Promise<{ users: User[] }> => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token almacenado:', token); // 🛠 Debug

    if (!token) throw new Error('No se encontró el token de autenticación');

    const response = await axios.get<{ users: User[] }>(
      `${API_BASE_URL}/users/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Respuesta de la API:', response.data); // 🛠 Debug

    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    throw error;
  }
};
