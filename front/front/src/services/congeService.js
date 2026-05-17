import api from "./api";

export const getAllConges = async () => {
    const response = await api.get("/conges");
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