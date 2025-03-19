import React, { useEffect, useState } from "react";
import { DataView } from "primereact/dataview";
import axios from "axios";

type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
};

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/listaUsuarios/");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching data of user list:", error);
      }
    };

    fetchUsers();
  }, []);

  const userTemplate = (user: User) => {
    return (
      <div className="p-col-12 p-md-4 p-lg-3">
        <div className="p-card">
          <div className="p-card-body">
            <h5>{user.username}</h5>
            <p>
              {user.first_name} {user.last_name}
            </p>
            <p>Status: {user.status}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <DataView value={users} itemTemplate={userTemplate} />
    </div>
  );
};

export default UserList;
