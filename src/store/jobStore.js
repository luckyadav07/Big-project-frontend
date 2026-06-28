import { create } from "zustand";
import { getAllJobs, getRecommendedJobs } from "../services/jobService.js";

const getErrorMessage = (err) =>
  err.response?.data?.message ||
  err.message ||
  "Something went wrong.";

const useJobStore = create((set) => ({
  jobs: [],
  recommendedJobs: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchJobs: async () => {
    set({ loading: true, error: null });

    try {
      const res = await getAllJobs();

      set({
        jobs: res.data || res,
        loading: false,
      });
    } catch (err) {
      set({
        jobs: [],
        loading: false,
        error: getErrorMessage(err),
      });
    }
  },

  fetchRecommended: async () => {
    set({ loading: true, error: null });

    try {
      const res = await getRecommendedJobs();

      set({
        recommendedJobs: res.data || res,
        loading: false,
      });
    } catch (err) {
      set({
        recommendedJobs: [],
        loading: false,
        error: getErrorMessage(err),
      });
    }
  },
}));

export default useJobStore;