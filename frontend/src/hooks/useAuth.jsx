import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/auth.js';
import { clearToken, setToken } from '../services/api.js';

const USER_KEY = 'margin-notes-user';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const expireSession = () => {
      clearToken();
      localStorage.removeItem(USER_KEY);
      setUser(null);
    };
    window.addEventListener('session-expired', expireSession);
    return () => window.removeEventListener('session-expired', expireSession);
  }, []);

  async function signIn(credentials, mode) {
    const result = mode === 'register'
      ? await authApi.register(credentials)
      : await authApi.login(credentials);
    setToken(result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    setUser(result.user);
  }

  function signOut() {
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}