import api from "./api";

export const getAllUtilisateurs = async () => {
    const response = await api.get("/admin/utilisateurs");
    return response.data;
};

export const createUtilisateur = async (data) => {
    const response = await api.post("/admin/utilisateurs", data);
    return response.data;
};

export const updateUtilisateur = async (id, data) => {
    const response = await api.put(`/admin/utilisateurs/${id}`, data);
    return response.data;
};

export const activerUtilisateur = async (id) => {
    const response = await api.put(`/admin/utilisateurs/${id}/activer`);
    return response.data;
};

export const desactiverUtilisateur = async (id) => {
    const response = await api.put(`/admin/utilisateurs/${id}/desactiver`);
    return response.data;
};

export const deleteUtilisateur = async (id) => {
    await api.delete(`/admin/utilisateurs/${id}`);
};