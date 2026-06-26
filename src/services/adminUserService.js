import api from "./api.js";
import { ADMIN } from "../api/endpoints.js";

const extractArray = (data, key) => {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];

    if (Array.isArray(data[key])) return data[key];
    if (Array.isArray(data.data?.[key])) return data.data[key];
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.data)) return data.data.data;

    return [];
};

const extractObject = (data, key) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    const candidate = data[key] || data.data?.[key] || data.data || data;
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;
    return candidate;
};

export const getAllUsers = async () => {
    const response = await api.get(ADMIN.USERS);
    return extractArray(response.data, "users");
};

export const getUserById = async (id) => {
    const response = await api.get(`${ADMIN.USERS}/${id}`);
    return extractObject(response.data, "user");
};

export const updateUserRole = async (id, data) => {
    const response = await api.patch(`${ADMIN.USERS}/${id}`, data);
    return extractObject(response.data, "user");
};

export const deleteUser = async (id) => {
    const response = await api.delete(`${ADMIN.USERS}/${id}`);
    return response.data?.success || response.data;
};
