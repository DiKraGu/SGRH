import api from "./api";

export const getHistoriqueActions = async () => {
    const response = await api.get("/admin/historique");
    return response.data;
};