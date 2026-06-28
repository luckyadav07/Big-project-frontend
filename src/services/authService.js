/**
 * services/authService.js
 * Auth-related API calls used by Login, Register, and AuthContext.
 * Keeps HTTP logic separate from UI components.
 */

import api from "./api.js";

export const registerUser = async ({
    name,
    email,
    password,
}) => {
    const response = await api.post("/auth/register", {
        name,
        email,
        password,
    });

    return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data.data;
};


export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
