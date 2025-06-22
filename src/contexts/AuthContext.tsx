import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  primaryCaregiver?: string;
  createdAt?: string;
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

// Backend API configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Demo users for fallback
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [useBackend, setUseBackend] = useState(true);

  // Check if backend is available
  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/../health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.log('🔄 Backend not available, using local storage fallback');
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing authentication...');
      
      // Check if backend is available
      const backendAvailable = await checkBackendHealth();
      setUseBackend(backendAvailable);
      
      if (backendAvailable) {
        console.log('✅ Backend available, checking for existing session...');
        await checkBackendSession();
      } else {
        console.log('📱 Using local storage fallback...');
        await checkLocalSession();
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const checkBackendSession = async () => {
    try {
      const token = localStorage.getItem('eldercare_token');
      if (!token) {
        console.log('❌ No token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Found valid session:', data.data.user.username);
        setUser({
          id: data.data.user._id,
          email: data.data.user.email,
          username: data.data.user.username,
          fullName: data.data.user.fullName,
          age: data.data.user.age,
          gender: data.data.user.gender,
          primaryCaregiver: data.data.user.primaryCaregiver,
          createdAt: data.data.user.createdAt
        });
      } else {
        console.log('❌ Invalid token, removing...');
        localStorage.removeItem('eldercare_token');
      }
    } catch (error) {
      console.error('❌ Error checking backend session:', error);
      localStorage.removeItem('eldercare_token');
    }
  };

  const checkLocalSession = () => {
    const savedUser = localStorage.getItem('eldercare_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('✅ Found saved local session:', userData.username);
        setUser(userData);
      } catch (error) {
        console.error('❌ Error parsing saved session:', error);
        localStorage.removeItem('eldercare_user');
      }
    } else {
      console.log('❌ No saved local session found');
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign in for username:', username);
      
      if (useBackend) {
        return await signInWithBackend(username, password);
      } else {
        return await signInWithLocal(username, password);
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signInWithBackend = async (username: string, password: string) => {
    try {
      // For demo purposes, we'll use email format for backend
      const email = username.includes('@') ? username : `${username}@eldercare.app`;
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Backend sign in successful:', data.data.user.username);
        
        // Save token
        localStorage.setItem('eldercare_token', data.data.token);
        
        // Set user
        const userData = {
          id: data.data.user.id,
          email: data.data.user.email,
          username: data.data.user.username,
          fullName: data.data.user.fullName,
          age: data.data.user.age,
          gender: data.data.user.gender,
          primaryCaregiver: data.data.user.primaryCaregiver,
          createdAt: data.data.user.createdAt
        };
        setUser(userData);
        
        return {};
      } else {
        console.log('❌ Backend sign in failed:', data.message);
        return { error: data.message || 'Invalid username or password' };
      }
    } catch (error) {
      console.error('❌ Backend sign in error:', error);
      // Fallback to local auth
      console.log('🔄 Falling back to local authentication...');
      setUseBackend(false);
      return await signInWithLocal(username, password);
    }
  };

  const signInWithLocal = async (username: string, password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in our demo users or registered users
    const foundUser = users.find(u => u.username === username);
    
    if (!foundUser) {
      console.log('❌ User not found locally');
      return { error: 'Invalid username or password' };
    }
    
    // For demo, accept any password for existing users
    console.log('✅ Local sign in successful for:', foundUser.fullName);
    
    // Save session to localStorage
    localStorage.setItem('eldercare_user', JSON.stringify(foundUser));
    setUser(foundUser);
    
    return {};
  };

  const signUp = async (username: string, password: string, fullName: string, age?: number, gender?: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign up for username:', username);
      
      if (useBackend) {
        return await signUpWithBackend(username, password, fullName, age, gender);
      } else {
        return await signUpWithLocal(username, password, fullName, age, gender);
      }
    } catch (error) {
      console.error('❌ Sign up error:', error);
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithBackend = async (username: string, password: string, fullName: string, age?: number, gender?: string) => {
    try {
      const email = `${username}@eldercare.app`;
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
          fullName,
          age,
          gender,
          primaryCaregiver: ''
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Backend sign up successful:', data.data.user.username);
        
        // Save token
        localStorage.setItem('eldercare_token', data.data.token);
        
        // Set user
        const userData = {
          id: data.data.user.id,
          email: data.data.user.email,
          username: data.data.user.username,
          fullName: data.data.user.fullName,
          age: data.data.user.age,
          gender: data.data.user.gender,
          primaryCaregiver: data.data.user.primaryCaregiver,
          createdAt: data.data.user.createdAt
        };
        setUser(userData);
        
        return {};
      } else {
        console.log('❌ Backend sign up failed:', data.message);
        return { error: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('❌ Backend sign up error:', error);
      // Fallback to local auth
      console.log('🔄 Falling back to local registration...');
      setUseBackend(false);
      return await signUpWithLocal(username, password, fullName, age, gender);
    }
  };

  const signUpWithLocal = async (username: string, password: string, fullName: string, age?: number, gender?: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if username already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      console.log('❌ Username already exists locally');
      return { error: 'Username already exists' };
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: `${username}@eldercare.app`,
      username,
      fullName,
      age,
      gender: gender as any,
      createdAt: new Date().toISOString()
    };
    
    console.log('✅ Local sign up successful for:', newUser.fullName);
    
    // Add to users list
    setUsers(prev => [...prev, newUser]);
    
    // Save session to localStorage
    localStorage.setItem('eldercare_user', JSON.stringify(newUser));
    setUser(newUser);
    
    return {};
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      console.log('🔄 Updating profile for:', user.username);
      
      if (useBackend) {
        await updateProfileWithBackend(updates);
      } else {
        await updateProfileWithLocal(updates);
      }
      
      console.log('✅ Profile updated successfully');
    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }
  };

  const updateProfileWithBackend = async (updates: Partial<User>) => {
    try {
      const token = localStorage.getItem('eldercare_token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: updates.fullName,
          age: updates.age,
          gender: updates.gender,
          primaryCaregiver: updates.primaryCaregiver,
          email: updates.email
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = {
          id: data.data.user._id,
          email: data.data.user.email,
          username: data.data.user.username,
          fullName: data.data.user.fullName,
          age: data.data.user.age,
          gender: data.data.user.gender,
          primaryCaregiver: data.data.user.primaryCaregiver,
          createdAt: data.data.user.createdAt
        };
        setUser(updatedUser);
      } else {
        throw new Error('Failed to update profile on backend');
      }
    } catch (error) {
      console.error('❌ Backend profile update error:', error);
      // Fallback to local update
      await updateProfileWithLocal(updates);
    }
  };

  const updateProfileWithLocal = async (updates: Partial<User>) => {
    if (!user) return;
    
    // Create updated user object
    const updatedUser = { ...user, ...updates };
    
    // Update in users list
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    
    // Update current user
    setUser(updatedUser);
    
    // Save to localStorage
    localStorage.setItem('eldercare_user', JSON.stringify(updatedUser));
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🔄 Signing out...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear all stored data
      localStorage.removeItem('eldercare_token');
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