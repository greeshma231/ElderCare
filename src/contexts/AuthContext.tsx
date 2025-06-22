import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  primaryCaregiver?: string;
  createdAt: string;
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

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'eldercare_users',
  CURRENT_USER: 'eldercare_current_user',
  SESSION: 'eldercare_session'
};

// Demo users for initial setup
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'shelly@eldercare.app',
    username: 'shelly',
    fullName: 'Shelly Thompson',
    age: 72,
    gender: 'Female',
    primaryCaregiver: 'Sarah Johnson',
    createdAt: '2024-01-15T10:30:00Z'
  }
];

// Demo passwords (in real app, these would be hashed)
const DEMO_PASSWORDS: { [key: string]: string } = {
  'shelly': 'password123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize local storage with demo data if empty
  const initializeStorage = () => {
    const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!existingUsers) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
      localStorage.setItem('eldercare_passwords', JSON.stringify(DEMO_PASSWORDS));
    }
  };

  // Get all users from localStorage
  const getUsers = (): User[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
      return [];
    }
  };

  // Get all passwords from localStorage
  const getPasswords = (): { [key: string]: string } => {
    try {
      const passwords = localStorage.getItem('eldercare_passwords');
      return passwords ? JSON.parse(passwords) : {};
    } catch (error) {
      console.error('Error parsing passwords from localStorage:', error);
      return {};
    }
  };

  // Save users to localStorage
  const saveUsers = (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  };

  // Save passwords to localStorage
  const savePasswords = (passwords: { [key: string]: string }) => {
    localStorage.setItem('eldercare_passwords', JSON.stringify(passwords));
  };

  // Check for existing session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing local authentication...');
      
      // Initialize storage with demo data
      initializeStorage();
      
      // Check for existing session
      const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      
      if (savedSession && savedUser) {
        try {
          const sessionData = JSON.parse(savedSession);
          const userData = JSON.parse(savedUser);
          
          // Check if session is still valid (24 hours)
          const sessionAge = Date.now() - sessionData.timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge < maxAge) {
            console.log('✅ Found valid session for:', userData.username);
            setUser(userData);
          } else {
            console.log('❌ Session expired, clearing...');
            localStorage.removeItem(STORAGE_KEYS.SESSION);
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
          }
        } catch (error) {
          console.error('❌ Error parsing session data:', error);
          localStorage.removeItem(STORAGE_KEYS.SESSION);
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        }
      } else {
        console.log('❌ No valid session found');
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (username: string, password: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign in for username:', username);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getUsers();
      const passwords = getPasswords();
      
      // Find user by username
      const foundUser = users.find(u => u.username === username);
      
      if (!foundUser) {
        console.log('❌ User not found');
        return { error: 'Invalid username or password' };
      }
      
      // Check password
      const storedPassword = passwords[username];
      if (!storedPassword || storedPassword !== password) {
        console.log('❌ Invalid password');
        return { error: 'Invalid username or password' };
      }
      
      console.log('✅ Sign in successful for:', foundUser.fullName);
      
      // Create session
      const sessionData = {
        userId: foundUser.id,
        timestamp: Date.now()
      };
      
      // Save session and user data
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(foundUser));
      setUser(foundUser);
      
      return {};
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    username: string, 
    password: string, 
    fullName: string, 
    age?: number, 
    gender?: string
  ): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign up for username:', username);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const users = getUsers();
      const passwords = getPasswords();
      
      // Check if username already exists
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        console.log('❌ Username already exists');
        return { error: 'Username already exists' };
      }
      
      // Check if email already exists
      const email = `${username}@eldercare.app`;
      const existingEmail = users.find(u => u.email === email);
      if (existingEmail) {
        console.log('❌ Email already exists');
        return { error: 'Email already exists' };
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        username,
        fullName,
        age,
        gender: gender as any,
        createdAt: new Date().toISOString()
      };
      
      console.log('✅ Sign up successful for:', newUser.fullName);
      
      // Save new user and password
      const updatedUsers = [...users, newUser];
      const updatedPasswords = { ...passwords, [username]: password };
      
      saveUsers(updatedUsers);
      savePasswords(updatedPasswords);
      
      // Create session
      const sessionData = {
        userId: newUser.id,
        timestamp: Date.now()
      };
      
      // Save session and user data
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      setUser(newUser);
      
      return {};
    } catch (error) {
      console.error('❌ Sign up error:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      if (!user) throw new Error('No user logged in');
      
      console.log('🔄 Updating profile for:', user.username);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      // Update user data
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      
      // Save updated users
      saveUsers(users);
      
      // Update current user in localStorage and state
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      console.log('✅ Profile updated successfully');
    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('🔄 Signing out...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear all session data
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
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