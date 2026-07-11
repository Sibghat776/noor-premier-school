import { useState, useCallback } from 'react';

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));

  const loginFn = useCallback((newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    setToken(null);
  }, []);

  const isAuthenticated = useCallback(() => {
    const t = localStorage.getItem('adminToken');
    if (!t) return false;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }, []);

  const getToken = useCallback(() => localStorage.getItem('adminToken'), []);

  return { token, login: loginFn, logout, isAuthenticated, getToken };
}
