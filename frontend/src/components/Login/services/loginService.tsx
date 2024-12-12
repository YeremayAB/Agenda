import axios from "axios";

const API_URL = "http://localhost:3000/api/";

export const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}token/`, { username, password });

    if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
    }

    return response.data;
};

export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};
