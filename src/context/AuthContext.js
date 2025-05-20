// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser]   = useState(null);

  // whenever token changes, decode or refetch user-info
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // optionally decode from JWT or fetch /auth/me
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ username: payload.username, role: payload.role });
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      setUser(null);
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post('/auth/login', { username, password });
    setToken(res.data.token);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
