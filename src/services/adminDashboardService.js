import api from "./api";
import { ADMIN } from "../api/endpoints";

export const getDashboardStats = async () => {
    const response = await api.get(`${ADMIN.BASE}/dashboard`);
    return response.data.data;
};