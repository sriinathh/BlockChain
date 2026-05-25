import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      api.setAuthToken(token);
    } else {
      localStorage.removeItem('authToken');
      api.setAuthToken(null);
    }
  }, [token]);

  const register = async (payload) => {
    const res = await api.register(payload);
    if (res?.token) setToken(res.token);
    if (res?.user) setUser(res.user);
    return res;
  };

  const login = async (payload) => {
    const res = await api.login(payload);
    if (res?.token) setToken(res.token);
    if (res?.user) setUser(res.user);
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
