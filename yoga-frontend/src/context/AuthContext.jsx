import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, setToken, getUser, logout } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    setUser(getUser());
  }, []);

  const login = (token) => {
    setToken(token);
    setUser(getUser());
  };

  const signout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
