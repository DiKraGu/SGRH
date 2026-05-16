import api from "./api";

export const getAllCandidatures = async () => {
    const response = await api.get("/candidatures");
    return response.data;
};

export const updateCandidatureStatut = async (id, statut) => {
    const response = await api.put(`/candidatures/${id}/statut?statut=${statut}`);
    return response.data;
};