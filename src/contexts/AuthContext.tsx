import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a stored user session
    const storedUser = localStorage.getItem('eldercare_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Create a mock session for the stored user
        setSession({
          access_token: 'mock_token',
          refresh_token: 'mock_refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: userData.id,
            email: `${userData.username}@eldercare.local`,
            user_metadata: {},
            app_metadata: {},
            aud: 'authenticated',
            created_at: userData.created_at
          }
        } as Session);
      } catch (error) {
        localStorage.removeItem('eldercare_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      
      // Check credentials against our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (userError) {
        console.error('Database error:', userError);
        return { error: 'Database connection error' };
      }

      if (!userData) {
        return { error: 'Invalid username or password' };
      }

      // For demo purposes, we'll use a simple password check
      // In production, you'd use proper password hashing (bcrypt, etc.)
      if (password !== 'password123') {
        return { error: 'Invalid username or password' };
      }

      // Store user data and create session
      setUser(userData);
      localStorage.setItem('eldercare_user', JSON.stringify(userData));
      
      // Create a mock session
      setSession({
        access_token: 'mock_token',
        refresh_token: 'mock_refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: userData.id,
          email: `${userData.username}@eldercare.local`,
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: userData.created_at
        }
      } as Session);

      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username: string, password: string, fullName: string, age?: number, gender?: string) => {
    try {
      setLoading(true);

      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (checkError) {
        console.error('Database error:', checkError);
        return { error: 'Database connection error' };
      }

      if (existingUser) {
        return { error: 'Username already exists' };
      }

      // Generate a unique ID for the user
      const userId = crypto.randomUUID();

      // Create the user record
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          username,
          password_hash: 'hashed_password', // In production, hash the password properly
          full_name: fullName,
          age,
          gender,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user record:', insertError);
        return { error: 'Failed to create user account' };
      }

      // Store user data and create session
      setUser(newUser);
      localStorage.setItem('eldercare_user', JSON.stringify(newUser));
      
      // Create a mock session
      setSession({
        access_token: 'mock_token',
        refresh_token: 'mock_refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: newUser.id,
          email: `${newUser.username}@eldercare.local`,
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: newUser.created_at
        }
      } as Session);

      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('eldercare_user');
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};