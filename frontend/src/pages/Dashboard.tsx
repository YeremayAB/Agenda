import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
// import { Dropdown } from "primereact/dropdown";
import "../assets/styles/Dashboard.css";
import Header2 from "../components/Header/Header2";
import { getUsers, User } from "../components/Login/services/UsersService";
import axios from "axios";

/**
 * Componente principal del panel de administración (Dashboard).
 * Muestra una lista de usuarios de búqueda y paginación.
 */

const Dashboard: React.FC = () => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImages, setProfileImages] = useState<{ [key: string]: string }>(
    {}
  );

  /**
   * Verifica si un string contienen números
   */
  const navigate = useNavigate();
  const containsNumbers = (str: string) => /\d/.test(str);

  /**
   * Obtiene los usuarios desde el servicio 'getUsers()', filtra duplicados, y no muestra los usuarios
   * con números en su nombre de usuario.
   * 
   * Se ejecuta en 'useEffect()' al montar el componente
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        console.log("Usuarios recibidos:", response);

        if (!response || !response.users) {
          throw new Error("Error: La API no devolvió usuarios válidos.");
        }

        // Filtrar usuarios con números en su 'userPrincipalName'
        const filteredUsers: User[] = response.users.filter(
          (user) => !containsNumbers(user.userPrincipalName || "")
        );

        // Ordenar usuarios alfabéticamente por `displayName`
        const sortedUsers = filteredUsers.sort((a, b) =>
          (a.displayName || "").localeCompare(b.displayName || "")
        );

        setUsers(sortedUsers);
        fetchProfilePictures(sortedUsers);
      } catch (err) {
        console.error("❌ Error cargando usuarios:", err);
        setError("Error cargando usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /**
   * Obtiene imágenes de perfil de los usuarios desde Microsoft Graph API.
   * @param {User[]} users - Lista de usuarios a procesar.
   */
  const fetchProfilePictures = async (users: User[]) => {
    const graphToken = localStorage.getItem("ms_token");
    if (!graphToken) {
      console.warn("⚠️ No se encontró el token de Microsoft Graph.");
      return;
    }

    const images: { [key: string]: string } = {};

    await Promise.all(
      users.map(async (user) => {
        if (!user.profile_image) {
          // Si no tiene imagen en la API, buscar en Microsoft Graph
          try {
            console.log(`🔍 Buscando foto de: ${user.userPrincipalName}...`);

            const response = await axios.get(
              `https://graph.microsoft.com/v1.0/users/${user.userPrincipalName}/photo/$value`,
              {
                headers: {
                  Authorization: `Bearer ${graphToken}`,
                  "Content-Type": "application/json",
                },
                responseType: "blob",
              }
            );

            if (response.status === 200) {
              const imageUrl = URL.createObjectURL(response.data);
              images[user.id] = imageUrl;
            }
          } catch (error: any) {
            if (error.response?.status === 403) {
              console.warn(
                `🚫 No tienes permisos para ver la foto de ${user.displayName}.`
              );
            } else if (error.response?.status === 404) {
              console.warn(
                `⚠️ No hay foto de perfil para ${user.displayName}.`
              );
            } else {
              console.error(
                `❌ Error al obtener la imagen para ${user.displayName}:`,
                error
              );
            }
          }
        }
      })
    );

    setProfileImages((prevImages) => ({ ...prevImages, ...images }));
  };

  /**
   * Renderiza la imagen de perfil de un usuario o sus iniciales si no tiene imagen
   * @param {User} rowData - Datos del usuario
   * @returns {JSX.Element} - Imagen o iniciales en un div
   */
  const renderProfilePicture = (rowData: User) => {
    const profileImage = rowData.profile_image || profileImages[rowData.id];

    if (profileImage) {
      console.log(
        `📸 Mostrando imagen para ${rowData.displayName}: ${profileImage}`
      );

      return (
        <img
          src={profileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
          onLoad={(e) =>
            console.log(`✅ Imagen cargada correctamente: ${profileImage}`)
          }
          onError={(e) => {
            console.warn(
              `⚠️ Error al cargar imagen para ${rowData.displayName}`
            );
            e.currentTarget.src = ""; // Forzar a que muestre iniciales si hay error
          }}
        />
      );
    } else {
      const name = rowData.displayName || "N/A";
      const initials = name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("");

      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-white text-xl">
          {initials}
        </div>
      );
    }
  };

  /**
   * Redirige a la página de perfil del usuario.
   * @param {User} rowData - Datos del usuario seleccionado.
   */
  const handleCellClick = (rowData: User) => {
    navigate(`/user_profile/${rowData.id}`, { state: { userData: rowData } });
  };

  // Filtrar usuarios según búsqueda
  const filteredData = users.filter((user) =>
    Object.values(user || {}).some(
      (val) =>
        val && val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div>
      <Header2 />

      <div className="p-8 bg-gray-100 min-h-screen">
        {/* Barra de búsqueda */}
        <div className="flex justify-center mt-12 mb-8">
          <div className="relative w-1/2">
            <i className="pi pi-search text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 font-karma" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="p-inputtext-lg w-full shadow-md rounded-full pl-12 py-3"
            />
          </div>
        </div>

        {/* Contenedor principal */}
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="bg-white p-6 shadow-lg rounded-xl w-full max-w-[1500px] h-full min-h-[60vh]">
            {/* Contenedor de la tarjeta */}
            <div className="card-content">
              {loading ? (
                <p>Cargando usuarios...</p>
              ) : error ? (
                <p>{error}</p>
              ) : users.length > 0 ? (
                <DataTable
                  value={filteredData.slice(first, first + rows)}
                  className="data-table border border-gray-200 rounded-lg border-collapse mb-6"
                >
                   <Column
                    body={(rowData) => (
                      <div className="flex items-center justify-start ml-4">
                        <i className="pi pi-star text-yellow-500 cursor-pointer"></i>
                      </div>
                    )}
                    headerClassName="bg-[#5B7D83] text-white border border-gray-200 p-3"
                    bodyClassName="border border-gray-200 p-3 h-full"
                  />
                  {/* Columna de Foto de Perfil */}
                  <Column
                    header="Foto"
                    body={renderProfilePicture}
                    headerClassName="bg-[#5B7D83] text-white border border-gray-200 p-3 justify-center items-center"
                    bodyClassName="border border-gray-200 p-3 h-full cursor-pointer hover:bg-gray-200 flex justify-center items-center"
                  />

                  {/* Nombre Completo */}
                  <Column
                    field="displayName"
                    header="Nombre"
                    headerClassName="bg-[#5B7D83] text-white border border-gray-200 p-3"
                    bodyClassName="border border-gray-200 p-3 h-full cursor-pointer hover:bg-gray-200"
                    body={(rowData) => (
                      <span onClick={() => handleCellClick(rowData)}>
                        {rowData.displayName || "No disponible"}
                      </span>
                    )}
                  />

                  {/* Correo Electrónico */}
                  <Column
                    field="mail"
                    header="Correo"
                    headerClassName="bg-[#5B7D83] text-white border border-gray-200 p-3"
                    bodyClassName="border border-gray-200 p-3 h-full cursor-pointer hover:bg-gray-200"
                    body={(rowData) => (
                      <span onClick={() => handleCellClick(rowData)}>
                        {rowData.mail || "No disponible"}
                      </span>
                    )}
                  />

                  {/* Nombre de Usuario */}
                  <Column
                    field="userPrincipalName"
                    header="Usuario"
                    headerClassName="bg-[#5B7D83] text-white border border-gray-200 p-3"
                    bodyClassName="border border-gray-200 p-3 h-full cursor-pointer hover:bg-gray-200"
                    body={(rowData) => {
                      const userPrincipalName =
                        rowData.userPrincipalName || "No disponible";
                      return containsNumbers(userPrincipalName)
                        ? ""
                        : userPrincipalName;
                    }}
                  />

                  <Column
                    field="phone"
                    header="Número de teléfono"
                    headerClassName="bg-[#5B7D83] text-white border border-gray-200 p-3"
                    bodyClassName="border border-gray-200 p-3 h-full cursor-pointer hover:bg-gray-200"
                    body={(rowData) => (
                      <span onClick={() => handleCellClick(rowData)}>
                        {rowData.businessPhones || "No disponible"}
                      </span>
                    )}
                  />
                </DataTable>
              ) : (
                <p>No hay usuarios disponibles.</p>
              )}

              <div className="paginator-container flex items-center justify-between mt-4 mb-6">
                {/* Paginador */}
                <Paginator
                  first={first}
                  rows={rows}
                  totalRecords={filteredData.length}
                  onPageChange={(e) => {
                    setFirst(e.first);
                    setRows(e.rows);
                  }}
                  className="rounded-lg border border-gray-300 shadow-sm p-2 bg-white"
                />

                {/* Selector de Tamaño */}
                <div className="flex items-center">
                  <label
                    htmlFor="table-size"
                    className="mr-2 font-semibold"
                  ></label>
                  <select
                    id="table-size"
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm bg-white text-gray-700 focus:ring focus:ring-blue-300"
                  >
                    <option value={5}>5 </option>
                    <option value={10}>10 </option>
                    <option value={25}>25 </option>
                    <option value={50}>50 </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
