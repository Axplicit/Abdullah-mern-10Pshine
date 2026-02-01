import api from "../api/axios";

export const getProfile = async (token) => {
  const res = await api.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (token, data) => {
  const res = await api.put("/auth/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const changePassword = async (token, data) => {
  const res = await api.put("/auth/change-password", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
