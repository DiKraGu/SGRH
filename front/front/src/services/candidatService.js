import api from "./api";

export const getOffresPubliques = async () => {
    const response = await api.get("/offres");
    return response.data;
};

export const postulerOffre = async (formData) => {
    const response = await api.post("/candidatures", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const consulterStatutCandidature = async (email) => {
    const response = await api.get(`/candidatures/statut?email=${email}`);
    return response.data;
};