import api from "../api/axios";

// =======================
// GET PROFILE
// =======================
export const getProfile = async (token) => {
  const res = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// =======================
// UPDATE PROFILE (name)
// =======================
export const updateProfile = async (token, data) => {
  const res = await api.put("/auth/me", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// =======================
// CHANGE PASSWORD
// =======================
export const changePassword = async (token, data) => {
  const res = await api.put("/auth/change-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
