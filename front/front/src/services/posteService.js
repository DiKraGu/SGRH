import api from "./api";

export const getAllPostes = async () => {
    const response = await api.get("/postes");
    return response.data;
};