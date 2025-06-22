import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  full_name: string;
  age?: number;
  gender?: string;
  primary_caregiver?: string;
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

// Demo users database (in a real app, this would be in a database)
const DEMO_USERS = [
  {
    id: '1',
    username: 'shelly',
    password: 'password123',
    full_name: 'Shelly Thompson',
    age: 72,
    gender: 'Female',
    primary_caregiver: 'Sarah Johnson'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('eldercare_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log('✅ Found saved user session:', userData.username);
          setUser(userData);
        } else {
          console.log('❌ No saved user session found');
        }
      } catch (error) {
        console.error('❌ Error checking saved auth:', error);
        localStorage.removeItem('eldercare_user');
      } finally {
        setLoading(false);
      }
    };

    // Small delay to show loading state briefly
    setTimeout(checkAuth, 500);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign in for username:', username);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in demo database
      const foundUser = DEMO_USERS.find(u => u.username === username && u.password === password);
      
      if (!foundUser) {
        console.log('❌ Invalid credentials');
        setLoading(false);
        return { error: 'Invalid username or password' };
      }

      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Save to localStorage
      localStorage.setItem('eldercare_user', JSON.stringify(userWithoutPassword));
      
      console.log('✅ Sign in successful for:', username);
      setUser(userWithoutPassword);
      setLoading(false);
      return {};
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (username: string, password: string, fullName: string, age?: number, gender?: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign up for username:', username);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if username already exists
      const existingUser = DEMO_USERS.find(u => u.username === username);
      if (existingUser) {
        console.log('❌ Username already exists');
        setLoading(false);
        return { error: 'Username already exists' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        full_name: fullName,
        age,
        gender,
        primary_caregiver: undefined
      };

      // Add to demo database (in memory)
      DEMO_USERS.push({ ...newUser, password });

      // Save to localStorage
      localStorage.setItem('eldercare_user', JSON.stringify(newUser));

      console.log('✅ Sign up successful for:', username);
      setUser(newUser);
      setLoading(false);
      return {};
    } catch (error) {
      console.error('❌ Sign up error:', error);
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🔄 Signing out...');
      
      // Remove from localStorage
      localStorage.removeItem('eldercare_user');
      
      // Clear user state
      setUser(null);
      
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    } finally {
      setLoading(false);
    }
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