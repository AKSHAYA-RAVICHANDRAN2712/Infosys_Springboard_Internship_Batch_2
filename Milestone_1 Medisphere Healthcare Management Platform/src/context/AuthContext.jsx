import { createContext, useContext, useState, useCallback } from 'react';
import MediStorage from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(() => MediStorage.getCurrentUser());

  const login = useCallback((user) => {
    MediStorage.setCurrentUser(user);
    setCurrentUserState(user);
  }, []);

  const logout = useCallback(() => {
    MediStorage.logout();
    setCurrentUserState(null);
  }, []);

  const refreshUser = useCallback(() => {
    setCurrentUserState(MediStorage.getCurrentUser());
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, refreshUser, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
