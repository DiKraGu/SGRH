import api from "./api";

export const getAllOffres = async () => {
    const response = await api.get("/offres");
    return response.data;
};

export const createOffre = async (offre) => {
    const response = await api.post("/offres", offre);
    return response.data;
};

export const updateOffre = async (id, offre) => {
    const response = await api.put(`/offres/${id}`, offre);
    return response.data;
};

export const fermerOffre = async (id) => {
    const response = await api.put(`/offres/${id}/fermer`);
    return response.data;
};