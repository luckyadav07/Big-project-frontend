import api from "./api.js";
import { ADMIN } from "../api/endpoints.js";

/**
 * Safely extract arrays from various API response structures:
 * - { jobs: [...] }
 * - { data: { jobs: [...] } }
 * - Direct array response
 * Falls back to empty array if no valid array found
 */
const extractArray = (data, key) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data[key])) {
    return data[key];
  }
  if (data && typeof data === "object" && Array.isArray(data.data?.[key])) {
    return data.data[key];
  }
  return [];
};

export const getAdminJobs = async () => {
  const response = await api.get(ADMIN.JOBS);
  return extractArray(response.data, "jobs");
};

export const getAdminUsers = async () => {
  const response = await api.get(ADMIN.USERS);
  return extractArray(response.data, "users");
};

const isRecordObject = (data) => {
  return (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    (data.id || data._id || data.email || data.title || data.company || data.name)
  );
};

const extractRecordObject = (data, key) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;

  const directRecord = data[key] || data.data?.[key];
  if (isRecordObject(directRecord)) return directRecord;

  const candidate = data.data || data;
  return isRecordObject(candidate) ? candidate : null;
};

export const createAdminJob = async (jobData) => {
  const response = await api.post(ADMIN.JOBS, jobData);
  return extractRecordObject(response.data, "job");
};

export const updateAdminJob = async (id, jobData) => {
  const response = await api.put(`${ADMIN.JOBS}/${id}`, jobData);
  return extractRecordObject(response.data, "job");
};

export const deleteAdminJob = async (id) => {
  const response = await api.delete(`${ADMIN.JOBS}/${id}`);
  return response.data?.success || response.data;
};

export const updateAdminUser = async (id, userData) => {
  const response = await api.put(`${ADMIN.USERS}/${id}`, userData);
  return extractRecordObject(response.data, "user");
};

export const deleteAdminUser = async (id) => {
  const response = await api.delete(`${ADMIN.USERS}/${id}`);
  return response.data?.success || response.data;
};
