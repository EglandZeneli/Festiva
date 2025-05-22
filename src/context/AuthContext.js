import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../axiosConfig';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On mount, load token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('festivaToken');
    if (token) {
      try {
        const { username, role, exp } = jwtDecode(token);
        if (exp * 1000 > Date.now()) {
          setUser({ username, role });
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          localStorage.removeItem('festivaToken');
        }
      } catch {
        localStorage.removeItem('festivaToken');
      }
    }
  }, []);

  // Register → POST /auth/register → auto-login
  async function register({ username, email, password }) {
    try {
      const res = await API.post('/auth/register', { username, email, password });
      if (!res.data.success) {
        throw new Error(res.data.error || 'Registration failed');
      }
      // after registering, log in with same credentials
      await login({ email, password });
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Registration failed'
      );
    }
  }

  // Login → POST /auth/login 
  async function login({ email, password }) {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (!res.data.success) {
        throw new Error(res.data.error || 'Login failed');
      }
      
      const token = res.data.token || res.data.accessToken;
      localStorage.setItem('festivaToken', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const { username, role } = jwtDecode(token);
      setUser({ username, role });
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Login failed'
      );
    }
  }

  function logout() {
    localStorage.removeItem('festivaToken');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);