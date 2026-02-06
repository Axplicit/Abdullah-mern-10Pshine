import api from "../api/axios";

// =======================
// GET PROFILE
// =======================
export const getProfile = async (token) => {
  const res = await api.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// =======================
// UPDATE PROFILE
// =======================
export const updateProfile = async (token, data) => {
  const res = await api.put("/auth/profile", data, {
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
