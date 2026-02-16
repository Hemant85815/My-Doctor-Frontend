import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

export type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';

export interface User {
  id: string; // Backend sends _id, but we might mape it or use _id
  _id?: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem('medicare_user');
    const token = localStorage.getItem('medicare_token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('medicare_user');
        localStorage.removeItem('medicare_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;

      const userWithId = { ...userData, id: userData._id }; // Ensure id exists

      setUser(userWithId);
      localStorage.setItem('medicare_user', JSON.stringify(userWithId));
      localStorage.setItem('medicare_token', token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
        role,
        specialization: role === 'doctor' ? 'General' : undefined // Default for now
      });
      const { token, ...userData } = response.data;

      const userWithId = { ...userData, id: userData._id };

      setUser(userWithId);
      localStorage.setItem('medicare_user', JSON.stringify(userWithId));
      localStorage.setItem('medicare_token', token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicare_user');
    localStorage.removeItem('medicare_token');
    window.location.href = '/login';
  };

  const forgotPassword = async (email: string): Promise<void> => {
    // Simulate API call for now as backend doesn't implement this yet
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset email sent to:', email);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      forgotPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

