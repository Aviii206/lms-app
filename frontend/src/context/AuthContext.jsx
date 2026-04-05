import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password, role) => {
    const { data } = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
      role,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
  };

  // REGISTER
  const register = async (name, email, password, role) => {
    const { data } = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      role,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};