import api from "./api.js";
import { APPLICATIONS } from "../api/endpoints.js";

export const getApplications = async () => {
    const response = await api.get(APPLICATIONS.LIST);
    return response.data.data;
};

export const applyJob = async (jobId) => {
    const response = await api.post(APPLICATIONS.CREATE, { jobId });
    return response.data.data;
};

export const withdrawApplication = async (id) => {
    const response = await api.delete(APPLICATIONS.DELETE(id));
    return response.data;
};

export const getAllApplications = async () => {
    const response = await api.get("/applications/admin");
    return response.data.data;
};

export const updateApplicationStatus = async (id, status) => {
    const response = await api.patch(
        `/applications/${id}/status`,
        { status }
    );

    return response.data.data;
};