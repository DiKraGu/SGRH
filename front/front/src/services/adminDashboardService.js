import api from "./api";

export const getAdminDashboardStats = async () => {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
};