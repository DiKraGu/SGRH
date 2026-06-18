import api from "./api";

export const getAllFichesPaie = async () => {
    const response = await api.get("/fiches-paie");
    return response.data;
};

export const getFichePaieById = async (id) => {
    const response = await api.get(`/fiches-paie/${id}`);
    return response.data;
};

export const getFichesPaieByEmploye = async (employeId) => {
    const response = await api.get(`/fiches-paie/employe/${employeId}`);
    return response.data;
};

export const createFichePaie = async (fichePaie) => {
    const response = await api.post("/fiches-paie", fichePaie);
    return response.data;
};

export const updateFichePaie = async (id, fichePaie) => {
    const response = await api.put(`/fiches-paie/${id}`, fichePaie);
    return response.data;
};

export const deleteFichePaie = async (id) => {
    const response = await api.delete(`/fiches-paie/${id}`);
    return response.data;
};