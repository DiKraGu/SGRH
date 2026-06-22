import api from "./api";

export const getAllPostes = async () => {
    const response = await api.get("/postes");
    return response.data;
};

export const createPoste = async (data) => {
    const response = await api.post("/postes", data);
    return response.data;
};

export const updatePoste = async (id, data) => {
    const response = await api.put(`/postes/${id}`, data);
    return response.data;
};

export const deletePoste = async (id) => {
    await api.delete(`/postes/${id}`);
};