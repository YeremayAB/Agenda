import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import "../assets/styles/Dashboard.css";
import Header2 from "../components/Header/Header2";

const Dashboard: React.FC = () => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token de acceso no encontrado");
        return;
      }
  
      const response = await fetch("http://localhost:3000/api/auth/users/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Respuesta del servidor:", errorData);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Verificar que los datos sean un array antes de asignarlos
      if (!Array.isArray(data)) {
        console.error("Los datos recibidos no son un array:", data);
        return;
      }
  
      setUsers(data);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para manejar el clic en una celda y redirigir
  const handleCellClick = (rowData: any) => {
    navigate(`/user_profile/${rowData.id}`, { state: { userData: rowData } });
  };

  const renderProfilePicture = (rowData: any) => {
    if (rowData.profile_image) {
      return (
        <img
          src={rowData.profile_image}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      );
    } else {
      const name = rowData.full_name || "";
      const initials = name
        .split(" ")
        .map((word: string) => word.charAt(0))
        .join("");
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-white">
          {initials}
        </div>
      );
    }
  };

  const filteredData = users.filter((user) =>
    Object.values(user).some(
      (val) =>
        val && val.toString().toLowerCase().includes(search.toLowerCase())
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

                {/* Otras columnas con datos del usuario */}
                {["full_name", "email", "position"].map((field, index) => (
                  <Column
                    key={index}
                    field={field}
                    header={field.charAt(0).toUpperCase() + field.slice(1)}
                    headerClassName="bg-[#5B7D83] text-white border border-gray-200 p-3"
                    bodyClassName="border border-gray-200 p-3 h-full cursor-pointer hover:bg-gray-200"
                    body={(rowData) => (
                      <span onClick={() => handleCellClick(rowData)}>
                        {rowData[field] || "No disponible"}
                      </span>
                    )}
                  />
                ))}
              </DataTable>

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
