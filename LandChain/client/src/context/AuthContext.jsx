import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session user using JWT validation on mount
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('landchain_jwt_token');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          if (response.success) {
            setCurrentUser(response.user);
          } else {
            localStorage.removeItem('landchain_jwt_token');
          }
        } catch (error) {
          console.error("Session restoration failed:", error.message);
          localStorage.removeItem('landchain_jwt_token');
        }
      }
      setIsLoading(false);
    };

    checkUserSession();
  }, []);

  const login = async (aadhaar, password) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(aadhaar, password);
      if (response.success) {
        localStorage.setItem('landchain_jwt_token', response.token);
        setCurrentUser(response.user);
        setIsLoading(false);
        return { success: true, user: response.user };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: error.message };
    }
  };

  const register = async (name, aadhaar, wallet, email, phone, password, district, state, profileImageFile) => {
    setIsLoading(true);
    try {
      // Compile fields into FormData to support file attachments
      const formData = new FormData();
      formData.append('name', name);
      formData.append('aadhaar', aadhaar);
      formData.append('wallet', wallet);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      formData.append('district', district);
      formData.append('state', state);
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      const response = await authAPI.register(formData);
      if (response.success) {
        localStorage.setItem('landchain_jwt_token', response.token);
        setCurrentUser(response.user);
        setIsLoading(false);
        return { success: true, user: response.user };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('landchain_jwt_token');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
