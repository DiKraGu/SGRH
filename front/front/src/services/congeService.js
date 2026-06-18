import api from "./api";

export const getAllConges = async () => {
    const response = await api.get("/conges");
    return response.data;
};

export const getCongesByEmploye = async (employeId) => {
    const response = await api.get(`/conges/employe/${employeId}`);
    return response.data;
};

export const demanderConge = async (conge) => {
    const response = await api.post("/conges", conge);
    return response.data;
};

export const validerConge = async (id) => {
    const response = await api.put(`/conges/${id}/valider`);
    return response.data;
};

export const refuserConge = async (id) => {
    const response = await api.put(`/conges/${id}/refuser`);
    return response.data;
};

export const annulerConge = async (id) => {
    const response = await api.delete(`/conges/${id}/annuler`);
    return response.data;
};