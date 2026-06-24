import { create } from "zustand";
import { getAllJobs, getRecommendedJobs } from "../services/jobService.js";
import { MOCK_JOBS } from "../utils/mockData.js";

const useJobStore = create((set) => ({
  jobs: [],
  recommendedJobs: [],
  loading: false,
  error: null,

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getAllJobs();
      set({ jobs: res.data || res, loading: false });
    } catch (err) {
      set({ jobs: [], loading: false, error: err.message || "Unable to load jobs." });
    }
  },

  fetchRecommended: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getRecommendedJobs();
      set({ recommendedJobs: res.data || res, loading: false });
    } catch (err) {
      set({ recommendedJobs: [], loading: false, error: err.message || "Unable to load recommended jobs." });
    }
  },
}));

export default useJobStore;
