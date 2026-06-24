import api from "./api";

export const getAllJobs = async () => {
    const response = await api.get("/jobs");
    return response.data;
};

export const getRecommendedJobs = async () => {
    const response = await api.get("/jobs/recommended");
    return response.data;
};