import api from "./api";

export const getProfilConnecte = async () => {
    const response = await api.get("/profil/me");
    return response.data;
};

export const updateProfilConnecte = async (data) => {
    const response = await api.put("/profil/me", data);
    return response.data;
};