import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  full_name: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
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

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: '1',
    username: 'shelly',
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
    // Check for existing session in localStorage
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('eldercare_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log('✅ Found existing session for:', userData.username);
          setUser(userData);
        } else {
          console.log('❌ No existing session found');
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        localStorage.removeItem('eldercare_user');
      } finally {
        // Always set loading to false after checking
        setTimeout(() => {
          setLoading(false);
        }, 500); // Small delay to prevent flash
      }
    };

    checkExistingSession();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign in for:', username);
      
      // Find user in demo users
      const foundUser = DEMO_USERS.find(u => u.username === username);
      
      if (!foundUser) {
        console.log('❌ User not found');
        setLoading(false);
        return { error: 'Invalid username or password' };
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('✅ Sign in successful for:', foundUser.username);
      
      // Save to localStorage
      localStorage.setItem('eldercare_user', JSON.stringify(foundUser));
      setUser(foundUser);
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
      console.log('🔄 Attempting sign up for:', username);

      // Check if username already exists
      const existingUser = DEMO_USERS.find(u => u.username === username);
      if (existingUser) {
        console.log('❌ Username already exists');
        setLoading(false);
        return { error: 'Username already exists' };
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        full_name: fullName,
        age,
        gender: gender as any
      };

      console.log('✅ Sign up successful for:', newUser.username);
      
      // Add to demo users (in real app, this would be saved to database)
      DEMO_USERS.push(newUser);
      
      // Save to localStorage
      localStorage.setItem('eldercare_user', JSON.stringify(newUser));
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
      console.log('🔄 Signing out...');
      localStorage.removeItem('eldercare_user');
      setUser(null);
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
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