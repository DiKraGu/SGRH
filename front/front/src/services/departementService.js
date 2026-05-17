import api from "./api";

export const getAllDepartements = async () => {
    const response = await api.get("/departements");
    return response.data;
};