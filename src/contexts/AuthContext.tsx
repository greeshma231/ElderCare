import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  primary_caregiver?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error?: string }>;
  signUp: (username: string, password: string, fullName: string, age?: number, gender?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
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
    email: 'shelly@eldercare.app',
    username: 'shelly',
    full_name: 'Shelly Thompson',
    age: 72,
    gender: 'Female',
    primary_caregiver: 'Sarah Johnson',
    created_at: '2024-01-15T10:30:00Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);

  useEffect(() => {
    // Simulate checking for existing session
    const checkSession = () => {
      console.log('🔄 Checking for existing session...');
      
      // Check localStorage for saved session
      const savedUser = localStorage.getItem('eldercare_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('✅ Found saved session:', userData.username);
          setUser(userData);
        } catch (error) {
          console.error('❌ Error parsing saved session:', error);
          localStorage.removeItem('eldercare_user');
        }
      } else {
        console.log('❌ No saved session found');
      }
      
      setLoading(false);
    };

    // Small delay to simulate real auth check
    setTimeout(checkSession, 500);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign in for username:', username);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in our demo users or registered users
      const foundUser = users.find(u => u.username === username);
      
      if (!foundUser) {
        console.log('❌ User not found');
        setLoading(false);
        return { error: 'Invalid username or password' };
      }
      
      // For demo, accept any password for existing users
      console.log('✅ Sign in successful for:', foundUser.full_name);
      
      // Save session to localStorage
      localStorage.setItem('eldercare_user', JSON.stringify(foundUser));
      setUser(foundUser);
      
      return {};
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username: string, password: string, fullName: string, age?: number, gender?: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign up for username:', username);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if username already exists
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        console.log('❌ Username already exists');
        setLoading(false);
        return { error: 'Username already exists' };
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: `${username}@eldercare.app`,
        username,
        full_name: fullName,
        age,
        gender: gender as any,
        created_at: new Date().toISOString()
      };
      
      console.log('✅ Sign up successful for:', newUser.full_name);
      
      // Add to users list
      setUsers(prev => [...prev, newUser]);
      
      // Save session to localStorage
      localStorage.setItem('eldercare_user', JSON.stringify(newUser));
      setUser(newUser);
      
      return {};
    } catch (error) {
      console.error('❌ Sign up error:', error);
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      console.log('🔄 Updating profile for:', user.username);
      
      // Create updated user object
      const updatedUser = { ...user, ...updates };
      
      // Update in users list
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      
      // Update current user
      setUser(updatedUser);
      
      // Save to localStorage
      localStorage.setItem('eldercare_user', JSON.stringify(updatedUser));
      
      console.log('✅ Profile updated successfully');
    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🔄 Signing out...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear session
      localStorage.removeItem('eldercare_user');
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
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};