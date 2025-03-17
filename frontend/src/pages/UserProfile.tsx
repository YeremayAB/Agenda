import React, { useEffect, useState, useCallback } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/UserProfile.css';
import { getUsers, User } from '../components/Login/services/UsersService';
import 'primeicons/primeicons.css';
import Header2 from '../components/Header/Header2';

/**
 * Componente de perfil de usuario.
 * Obtiene y muestra la información del usuario basado en su ID de la URL.
 * También intenta recuperar la imagen de perfil desde Microsoft Graph.
 *
 * **Estados:**
 * - `user` (User | null): Datos del usuario.
 * - `loading` (boolean): Indica si la información está cargando.
 * - `error` (string | null): Mensaje de error en caso de fallo.
 * - `profileImage` (string | null): URL de la imagen de perfil.
 * - `modalVisible` (boolean): Controla la visibilidad del modal de imagen.
 */
const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  /**
   * Obtiene la información del usuario desde la API.
   * 
   * **Parámetros:**
   * - `userId` (string): ID del usuario obtenido de la URL.
   * 
   * **Salida:**
   * - Actualiza el estado `user` con la información obtenida.
   * - Si se encuentra el usuario, llama a `fetchMicrosoftProfileImage()`.
   * - Maneja posibles errores en la obtención de datos.
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        console.log('Usuarios recibidos:', response);

        if (!response || !response.users) {
          throw new Error('Error: La API no devolvió usuarios válidos.');
        }

        const foundUser = response.users.find((u: User) => u.id === userId);
        if (!foundUser) {
          throw new Error('Usuario no encontrado.');
        }

        setUser(foundUser);
        fetchMicrosoftProfileImage(foundUser.mail ?? 'No disponible');
      } catch (err) {
        console.error('❌ Error cargando usuario:', err);
        setError('Error cargando usuario');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  /**
   * Intenta obtener la imagen de perfil del usuario desde Microsoft Graph.
   * 
   * **Parámetros:**
   * - `email` (string): Correo electrónico del usuario.
   * 
   * **Salida:**
   * - Si la imagen está disponible, actualiza `profileImage`.
   * - Si hay un error, lo maneja y lo muestra en consola.
   * 
   * **Notas:**
   * - Requiere un token de Microsoft Graph almacenado en `localStorage`.
   * - Puede fallar si el usuario no tiene imagen o si no hay permisos.
   */
  const fetchMicrosoftProfileImage = useCallback(async (email: string) => {
    if (!email) return;

    try {
      const graphToken = localStorage.getItem('ms_token');
      if (!graphToken) {
        console.warn('⚠️ No se encontró el token de Microsoft Graph.');
        return;
      }

      const response = await axios.get(
        `https://graph.microsoft.com/v1.0/users/${email}/photo/$value`,
        {
          headers: {
            Authorization: `Bearer ${graphToken}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );

      if (response.status === 200) {
        const imageURL = URL.createObjectURL(response.data);
        setProfileImage(imageURL);
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        console.warn(`🚫 No tienes permisos para ver la foto de ${email}.`);
      } else if (error.response?.status === 404) {
        console.warn(`⚠️ No hay foto de perfil para ${email}.`);
      } else {
        console.error(`❌ Error al obtener la imagen de ${email}:`, error);
      }
    }
  }, []);

  /**
   * Renderiza la imagen de perfil del usuario.
   * 
   * **Salida:**
   * - Si hay imagen de perfil, la muestra en un `Avatar`.
   * - Si no hay imagen, muestra las iniciales del usuario en un círculo.
   */
  const renderProfilePicture = () => {
    if (profileImage) {
      return (
        <Avatar 
          image={profileImage} 
          className='user-avatar-profile' 
          shape='circle' 
          style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => setModalVisible(true)}
        />
      );
    } else {
      const name = user?.displayName || 'Usuario';
      const initials = name.split(' ').map((word) => word.charAt(0)).join('');
      return <div className='w-20 h-20 rounded-full flex items-center justify-center bg-gray-300 text-white text-xl'>{initials}</div>;
    }
  };

  // Manejo de estados de carga y error
  if (loading) return <div>Cargando usuario...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No se encontró el usuario.</div>;

  return (
    <div>
      <Header2/>
      <Button icon='pi pi-arrow-left' className='back-button' onClick={() => navigate(-1)} />
      <div className='user-profile'>
        <h2 className='user-title'>{user.displayName} - <strong>{user.jobTitle ? user.jobTitle.toUpperCase() : 'Posición no disponible'}</strong></h2>
        <Card className='user-card'>
          <div className='user-content-profile'>
            <div className='user-avatar-container-profile'>{renderProfilePicture()}</div>
            <div className='user-info'>
              <p><strong>Email:</strong> {user.mail}</p>
              <p><strong>Teléfono:</strong> {user.businessPhones}</p>
              <p><strong>Teléfono móvil:</strong> {user.mobilePhone}</p>
              <p><strong>Posición:</strong> {user.jobTitle}</p>
              <p><strong>Departamento:</strong> {user.department}</p>
              <p><strong>Oficina:</strong> {user.office}</p>
            </div>
          </div>
        </Card>
      </div>
      <Dialog
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        header="Foto de Perfil"
        className="p-fluid"
        style={{ width: '500px',  height: '525px' }}
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="Foto de Perfil"
            className="profile-modal-img"
            onClick={() => setModalVisible(false)}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <div className="text-center">No hay imagen disponible</div>
        )}
      </Dialog>
    </div>
  );
};

export default UserProfile;