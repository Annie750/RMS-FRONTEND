import axiosInstance from "../api/axiosInstance";

const login = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  // Expected backend shape: { token: "...", user: { id, name, email, role } }
  // Adjust the destructuring below if your backend returns a different shape.
  const { token, user } = response.data;
  return { token, user };
};

const authService = { login };
export default authService;
