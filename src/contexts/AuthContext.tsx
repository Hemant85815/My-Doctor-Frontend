import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'doctor' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
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

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  { id: '1', email: 'admin@medicare.com', password: 'admin123', name: 'Dr. Sarah Johnson', role: 'admin', avatar: '' },
  { id: '2', email: 'doctor@medicare.com', password: 'doctor123', name: 'Dr. Michael Chen', role: 'doctor', avatar: '' },
  { id: '3', email: 'staff@medicare.com', password: 'staff123', name: 'Emily Davis', role: 'staff', avatar: '' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem('medicare_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('medicare_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('medicare_user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('medicare_token', 'mock_jwt_token_' + foundUser.id);
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      throw new Error('Email already registered');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
    };
    
    setUser(newUser);
    localStorage.setItem('medicare_user', JSON.stringify(newUser));
    localStorage.setItem('medicare_token', 'mock_jwt_token_' + newUser.id);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicare_user');
    localStorage.removeItem('medicare_token');
  };

  const forgotPassword = async (email: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (!foundUser) {
      throw new Error('Email not found');
    }
    
    // In real app, would send reset email
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
