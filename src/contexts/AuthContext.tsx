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

// In-memory user storage (resets on page refresh)
let inMemoryUsers: Array<{ id: string; username: string; password: string; full_name: string; age?: number; gender?: string }> = [
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
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user in memory
    const foundUser = inMemoryUsers.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setLoading(false);
      return {};
    }
    
    setLoading(false);
    return { error: 'Invalid username or password' };
  };

  const signUp = async (username: string, password: string, fullName: string, age?: number, gender?: string) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if username already exists
    const existingUser = inMemoryUsers.find(u => u.username === username);
    if (existingUser) {
      setLoading(false);
      return { error: 'Username already exists' };
    }
    
    // Create new user and add to memory
    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      full_name: fullName,
      age,
      gender
    };
    
    // Add to in-memory storage
    inMemoryUsers.push(newUser);
    
    // Set as current user (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setLoading(false);
    return {};
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
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