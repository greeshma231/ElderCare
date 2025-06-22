import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  username: string;
  full_name: string;
  age?: number;
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error?: string }>;
  signUp: (username: string, password: string, fullName: string, age?: number, gender?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo users for testing
const DEMO_USERS = [
  {
    id: '1',
    username: 'shelly',
    password: 'password123',
    full_name: 'Shelly Thompson',
    age: 72,
    gender: 'Female'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check demo users
    const demoUser = DEMO_USERS.find(u => u.username === username && u.password === password);
    
    if (demoUser) {
      const { password: _, ...userWithoutPassword } = demoUser;
      setUser(userWithoutPassword);
      setLoading(false);
      return {};
    }
    
    setLoading(false);
    return { error: 'Invalid username or password. Try: shelly / password123' };
  };

  const signUp = async (username: string, password: string, fullName: string, age?: number, gender?: string) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if username exists
    const existingUser = DEMO_USERS.find(u => u.username === username);
    if (existingUser) {
      setLoading(false);
      return { error: 'Username already exists' };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      full_name: fullName,
      age,
      gender
    };
    
    setUser(newUser);
    setLoading(false);
    return {};
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    setLoading(false);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};