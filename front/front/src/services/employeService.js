import api from "./api";

export const getAllEmployes = async () => {
    const response = await api.get("/employes");
    return response.data;
};

export const getEmployeById = async (id) => {
    const response = await api.get(`/employes/${id}`);
    return response.data;
};

export const getEmployeConnecte = async () => {
    const response = await api.get("/employes/me");
    return response.data;
};

export const createEmploye = async (employe) => {
    const response = await api.post("/employes", employe);
    return response.data;
};

export const updateEmploye = async (id, employe) => {
    const response = await api.put(`/employes/${id}`, employe);
    return response.data;
};

export const desactiverEmploye = async (id) => {
    const response = await api.put(`/employes/${id}/desactiver`);
    return response.data;
};