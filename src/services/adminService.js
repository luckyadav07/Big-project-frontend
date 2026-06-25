import api from "./api.js";
import { ADMIN } from "../api/endpoints.js";

/**
 * Safely extract jobs array from various API response structures:
 * - { jobs: [...] }
 * - { data: { jobs: [...] } }
 * - Direct array response
 * Falls back to empty array if no valid jobs found
 */
const extractJobsArray = (data) => {
  // If data is already an array, return it
  if (Array.isArray(data)) return data;

  // If data is an object with 'jobs' property that is an array, return it
  if (data && typeof data === "object" && Array.isArray(data.jobs)) {
    return data.jobs;
  }

  // If data has nested 'data.jobs' that is an array, return it
  if (data && typeof data === "object" && Array.isArray(data.data?.jobs)) {
    return data.data.jobs;
  }

  // Default to empty array
  return [];
};

export const getAdminJobs = async () => {
  const response = await api.get(ADMIN.JOBS);
  return extractJobsArray(response.data);
};

export const createAdminJob = async (jobData) => {
  const response = await api.post(ADMIN.JOBS, jobData);
  // Extract single job from response.data.job or response.data
  if (response.data && typeof response.data === "object") {
    return response.data.job || response.data;
  }
  return null;
};

export const updateAdminJob = async (id, jobData) => {
  const response = await api.put(`${ADMIN.JOBS}/${id}`, jobData);
  // Extract updated job from response.data.job or response.data
  if (response.data && typeof response.data === "object") {
    return response.data.job || response.data;
  }
  return null;
};

export const deleteAdminJob = async (id) => {
  const response = await api.delete(`${ADMIN.JOBS}/${id}`);
  return response.data?.success || response.data;
};
