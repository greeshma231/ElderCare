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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      
      // First, get the user's data from the username
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, password_hash')
        .eq('username', username)
        .maybeSingle();

      if (userError || !userData) {
        return { error: 'Invalid username or password' };
      }

      // For demo purposes, we'll use a simple password check
      // In production, you'd use proper password hashing (bcrypt, etc.)
      if (password !== 'password123') {
        return { error: 'Invalid username or password' };
      }

      // Create a session using Supabase auth with a dummy email
      const email = `${userData.id}@eldercare.local`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy_password', // This would be handled differently in production
      });

      if (error) {
        // If user doesn't exist in auth, create them
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password: 'dummy_password',
        });
        
        if (signUpError) {
          return { error: 'Authentication failed' };
        }
      }

      return {};
    } catch (error) {
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

      if (existingUser) {
        return { error: 'Username already exists' };
      }

      // Generate a unique email for Supabase auth
      const uniqueId = crypto.randomUUID();
      const email = `${uniqueId}@eldercare.local`;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: 'dummy_password', // In production, use the actual password
      });

      if (authError) {
        return { error: authError.message };
      }

      // Create the user record with the auth user ID
      if (authData.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            username,
            password_hash: 'hashed_password', // In production, hash the password properly
            full_name: fullName,
            age,
            gender,
          });

        if (insertError) {
          console.error('Error creating user record:', insertError);
          // Clean up the auth user if profile creation fails
          await supabase.auth.signOut();
          return { error: 'Failed to create user profile' };
        }
      }

      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
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