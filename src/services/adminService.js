import api from "./api.js";
import { ADMIN } from "../api/endpoints.js";

export const getAdminJobs = async () => {
  const response = await api.get(ADMIN.JOBS);
  return response.data;
};

export const createAdminJob = async (jobData) => {
  const response = await api.post(ADMIN.JOBS, jobData);
  return response.data;
};

export const updateAdminJob = async (id, jobData) => {
  const response = await api.put(`${ADMIN.JOBS}/${id}`, jobData);
  return response.data;
};

export const deleteAdminJob = async (id) => {
  const response = await api.delete(`${ADMIN.JOBS}/${id}`);
  return response.data;
};
