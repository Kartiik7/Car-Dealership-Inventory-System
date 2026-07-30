import { createContext, useContext, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

const storageKey = 'token';

const decodeToken = (value) => {
  if (!value) {
    return null;
  }

  try {
    const payload = value.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    const parsed = JSON.parse(json);
    if (parsed && parsed.exp && parsed.exp * 1000 < Date.now()) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(storageKey);
      }
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(storageKey) || '');
  const [user, setUser] = useState(() => decodeToken(localStorage.getItem(storageKey)));

  const login = (userData, nextToken) => {
    if (nextToken) {
      localStorage.setItem(storageKey, nextToken);
    }

    setUser(userData || decodeToken(nextToken));
    setToken(nextToken || '');
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setUser(null);
    setToken('');
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
