export const AUTH = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  PROFILE: "/auth/profile",
  ME: "/auth/me",
  LOGOUT: "/auth/logout",
};

export const JOBS = {
  LIST: "/jobs",
  DETAIL: (id) => `/jobs/${id}`,
  RECOMMENDED: "/jobs/recommended",
};

export const APPLICATIONS = {
  LIST: "/applications",
  CREATE: "/applications",
  UPDATE: (id) => `/applications/${id}`,
};

export const NOTIFICATIONS = {
  LIST: "/notifications",
  READ: (id) => `/notifications/${id}`,
};

export const RESUME = {
  UPLOAD: "/resume/upload",
  ANALYZE: "/resume/analyze",
};

export const CAREER_COACH = {
  MESSAGE: "/career-coach/message",
  HISTORY: "/career-coach/history",
};

export const ADMIN = {
  BASE: "/admin",
  USERS: "/admin/users",
  JOBS: "/admin/jobs",
};