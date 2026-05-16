import api from "./api";

export const getRhDashboardStats = async () => {
    const response = await api.get("/dashboard/rh/stats");
    return response.data;
};