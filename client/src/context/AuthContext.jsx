import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('privai_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('privai_token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          localStorage.setItem('privai_user', JSON.stringify(userData));
        } catch (error) {
          console.warn('[AuthContext] Verification failed:', error.message);
          logoutUser();
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
