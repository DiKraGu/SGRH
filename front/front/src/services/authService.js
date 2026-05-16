import api from "./api";

export const login = async (email, motDePasse) => {
    const response = await api.post("/auth/login", {
        email,
        motDePasse,
    });

    return response.data;
};