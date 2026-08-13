import axiosInstance from "../api/axiosInstance";

const login = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  const { token, user } = response.data;

  return { token, user };
};

const changePassword = async (currentPassword, newPassword) => {
  const response = await axiosInstance.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });

  return response.data;
};

const authService = {
  login,
  changePassword,
};

export default authService;
