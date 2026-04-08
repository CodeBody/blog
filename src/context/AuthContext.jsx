import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isBlogAdmin') === 'true';
  });

  const login = async (username, password) => {
    try {
      const res = await loginApi(username, password);
      if (res.code === 200) {
        setIsAuthenticated(true);
        localStorage.setItem('isBlogAdmin', 'true');
        return true;
      }
    } catch (e) {
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isBlogAdmin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
