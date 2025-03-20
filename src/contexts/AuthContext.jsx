import React, { createContext, useContext, useState } from 'react';
import authService from '../services/authService';
import api from "../services/api";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      await authService.login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.post("/auth/logout", {
      access: sessionStorage.getItem("accessToken"),
      refresh: sessionStorage.getItem("refreshToken"),
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      window.location.href = "/login";
    }).catch((error) => {
      alert(error);
    });
  };

  return (
    <AuthContext.Provider value={{ isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
