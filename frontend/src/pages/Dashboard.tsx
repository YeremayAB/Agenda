import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import "../assets/styles/Dashboard.css";
import Header2 from "../components/Header/Header2";

import { getUsers, User } from "../components/Login/services/UsersService";

const Dashboard: React.FC = () => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Obtener usuarios del servicio
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setError("Error cargando usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Manejar clic en la celda para redirigir a perfil de usuario
  const handleCellClick = (rowData: User) => {
    navigate(`/user_profile/${rowData.id}`, { state: { userData: rowData } });
  };

  // Renderizar imagen de perfil o iniciales
  const renderProfilePicture = (rowData: User) => {
    if (rowData.mail) {
      return (
        <img
          src={`https://www.gravatar.com/avatar/${btoa(rowData.mail)}?d=identicon`}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      );
    } else {
      const name = rowData.displayName || "";
      const initials = name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("");
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-white">
          {initials}
        </div>
      );
    }
  };

  // Filtrar usuarios según búsqueda
  const filteredData = users.filter((user) =>
    Object.values(user).some(
      (val) => val && val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div>
      <Header2 />

      <div className="p-8 bg-gray-100 min-h-screen">
        {/* Barra de búsqueda */}
        <div className="flex justify-center mt-12">
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
              ) : (
                <DataTable
                  value={filteredData.slice(first, first + rows)}
                  className="data-table border border-gray-200 rounded-lg border-collapse mb-6"
                >
                  {/* Columna de Foto de Perfil */}
                  <Column
                    header="Foto"
                    body={renderProfilePicture}
                    headerClassName="bg-[#5B7D83] text-white border border-gray-200 p-3"
                    bodyClassName="border border-gray-200 p-3 h-full cursor-pointer hover:bg-gray-200"
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
                    body={(rowData) => (
                      <span onClick={() => handleCellClick(rowData)}>
                        {rowData.userPrincipalName || "No disponible"}
                      </span>
                    )}
                  />
                </DataTable>
              )}

              {/* Paginador */}
              <div className="paginator-container flex justify-center mt-4 mb-6">
                <Paginator
                  first={first}
                  rows={rows}
                  totalRecords={filteredData.length}
                  rowsPerPageOptions={[5, 10, 25]}
                  onPageChange={(e) => {
                    setFirst(e.first);
                    setRows(e.rows);
                  }}
                  template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                  className="rounded-lg border border-gray-300 shadow-sm p-2 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;