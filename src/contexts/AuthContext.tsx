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
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
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

      console.log('Auth state changed:', event, session?.user?.id);
      
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
        // If user profile doesn't exist, that's okay - they might need to complete registration
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
      
      // For demo purposes, we'll use a simplified approach
      // Check if this is the demo user
      if (username === 'shelly' && password === 'password123') {
        // Create a demo session by signing in with a fixed email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'shelly@eldercare.demo',
          password: 'eldercare_demo_2024',
        });

        if (error) {
          // If user doesn't exist, create them
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'shelly@eldercare.demo',
            password: 'eldercare_demo_2024',
          });

          if (signUpError) {
            return { error: 'Failed to create demo account' };
          }

          // Create the demo user profile
          if (signUpData.user) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: signUpData.user.id,
                username: 'shelly',
                password_hash: 'demo_hash',
                full_name: 'Shelly Thompson',
                age: 72,
                gender: 'Female',
                primary_caregiver: 'Sarah Johnson',
              });

            if (insertError) {
              console.error('Error creating demo user profile:', insertError);
            }
          }
        }

        return {};
      } else {
        return { error: 'Invalid username or password. Use demo credentials: shelly / password123' };
      }
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

      // Generate a unique email for this user
      const email = `${username}_${Date.now()}@eldercare.local`;
      
      // Step 1: Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: 'eldercare_password_2024',
      });

      if (authError) {
        return { error: authError.message };
      }

      if (!authData.user) {
        return { error: 'Failed to create authentication account' };
      }

      // Step 2: Create user profile
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username,
          password_hash: 'hashed_password',
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