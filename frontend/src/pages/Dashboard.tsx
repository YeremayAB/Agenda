import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import Header from "../components/Header/Header";
import "../assets/styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [search, setSearch] = useState("");

  const data = Array.from({ length: 50 }, (_, i) => ({
    col1: "Text",
    col2: "Text",
    col3: "Text",
    col4: "Text",
    col5: "Text",
  }));

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      val.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div>
      <Header />

      <div className="p-8 bg-gray-100 min-h-screen">
        {/* Barra de búsqueda */}
        <div className="flex justify-center mt-12">
          <div className="relative w-1/2">
            <i className="pi pi-search text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
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
                {/* Columnas */}
                {["col1", "col2", "col3", "col4", "col5"].map((col, index) => (
                  <Column
                    key={index}
                    field={col}
                    header="Text"
                    headerClassName="bg-[#5B7D83] text-white border border-gray-200 p-3"
                    bodyClassName="border border-gray-200 p-3 h-full"
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
