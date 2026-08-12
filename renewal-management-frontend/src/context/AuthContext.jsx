import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {

    try {

      const stored = localStorage.getItem("user");

      if (!stored || stored === "undefined") {
        return null;
      }

      return JSON.parse(stored);

    } catch (error) {

      localStorage.removeItem("user");

      return null;

    }

  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("accessToken");

    if (token) {

      try {

        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }

      } catch (error) {

        logout();

      }

    }

    setLoading(false);

  }, []);

  const login = async (email, password) => {

    const data = await authService.login(email, password);

    localStorage.setItem("accessToken", data.token);

    // Support both backend response formats
    const userData = data.user ?? {
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    return data;

  };

  const logout = () => {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setUser(null);

  };

  const isAuthenticated = () => {

    const token = localStorage.getItem("accessToken");

    if (!token) return false;

    try {

      const decoded = jwtDecode(token);

      return decoded.exp * 1000 > Date.now();

    } catch {

      return false;

    }

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;