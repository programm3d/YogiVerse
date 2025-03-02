import { jwtDecode } from 'jwt-decode';

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  // Ensure the token has the correct format
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error('Invalid token format');
    return null;
  }

  return jwtDecode(token);
};

export const logout = () => {
  localStorage.removeItem('token');
};
