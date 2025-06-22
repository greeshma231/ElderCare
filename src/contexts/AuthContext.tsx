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
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('Initial session:', session?.user?.id || 'No session');
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          console.log('No session found, showing login');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, session?.user?.id || 'No user');
      
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } else {
        console.log('User profile fetched:', data);
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign in for username:', username);
      
      // First, check if this user exists in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, full_name')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        console.log('User not found in database');
        return { error: 'Invalid username or password' };
      }

      console.log('Found user in database:', userData);

      // For demo purposes, we'll accept any password for existing users
      // In production, you'd verify the password hash
      const email = `${userData.id}@eldercare.app`;
      
      // Try to sign in with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: 'eldercare_password_2024', // Fixed password for demo
      });

      if (authError) {
        console.log('Auth user not found, creating auth account for existing user');
        
        // If auth user doesn't exist, create one for this existing user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: 'eldercare_password_2024',
        });

        if (signUpError) {
          console.error('Failed to create auth account:', signUpError);
          return { error: 'Authentication failed' };
        }

        console.log('Created auth account for existing user');
      }

      console.log('Sign in successful');
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
      console.log('Attempting sign up for username:', username);

      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        console.log('Username already exists');
        return { error: 'Username already exists' };
      }

      // Generate a unique email for this user
      const uniqueId = crypto.randomUUID();
      const email = `${uniqueId}@eldercare.app`;

      console.log('Creating auth user with email:', email);

      // Step 1: Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: 'eldercare_password_2024', // Fixed password for demo
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { error: authError.message };
      }

      if (!authData.user) {
        return { error: 'Failed to create authentication account' };
      }

      console.log('Auth user created:', authData.user.id);

      // Step 2: Create user profile in our users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username,
          password_hash: 'hashed_password', // In production, hash the actual password
          full_name: fullName,
          age,
          gender,
        });

      if (insertError) {
        console.error('Error creating user record:', insertError);
        // Clean up the auth user if profile creation fails
        await supabase.auth.signOut();
        return { error: 'Failed to create user profile. Please try again.' };
      }

      console.log('User profile created successfully');
      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
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