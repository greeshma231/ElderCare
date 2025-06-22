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
    console.log('🔄 AuthProvider initializing...');
    
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('📋 Session check:', { 
          hasSession: !!session, 
          userId: session?.user?.id || 'none',
          error: error?.message || 'none'
        });

        if (session?.user?.id) {
          console.log('✅ Session found, fetching user profile...');
          setSession(session);
          
          // Get user profile from our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userData && !userError) {
            console.log('✅ User profile loaded:', userData.username);
            setUser(userData);
          } else {
            console.log('❌ User profile not found:', userError?.message);
            // If no profile found, sign out the auth user
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
          }
        } else {
          console.log('❌ No session found');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setSession(null);
        setUser(null);
      } finally {
        console.log('🏁 Auth initialization complete, setting loading to false');
        setLoading(false);
      }
    };

    // Add a small delay to prevent flash
    const timer = setTimeout(initializeAuth, 100);

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, !!session);
      
      setSession(session);
      
      if (session?.user?.id) {
        // Fetch user profile
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userData && !error) {
          console.log('✅ Profile loaded on auth change:', userData.username);
          setUser(userData);
        } else {
          console.log('❌ Profile not found on auth change');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign in for:', username);
      
      // Check if user exists in our database first
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id, username, full_name')
        .eq('username', username)
        .single();

      if (!existingUser || userCheckError) {
        console.log('❌ User not found in database');
        setLoading(false);
        return { error: 'Invalid username or password' };
      }

      console.log('✅ User found in database:', existingUser.username);

      // Try to sign in with Supabase auth
      const email = `${username}@eldercare.app`;
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'eldercare_password_2024' // Fixed demo password
      });

      if (signInError) {
        console.log('🔄 Auth user not found, creating auth account...');
        
        // Create auth user for existing database user
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password: 'eldercare_password_2024'
        });

        if (signUpError) {
          console.error('❌ Failed to create auth account:', signUpError.message);
          setLoading(false);
          return { error: 'Authentication failed' };
        }

        console.log('✅ Auth account created and signed in');
      } else {
        console.log('✅ Sign in successful');
      }

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
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        console.log('❌ Username already exists');
        setLoading(false);
        return { error: 'Username already exists' };
      }

      // Create auth user first
      const email = `${username}@eldercare.app`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: 'eldercare_password_2024'
      });

      if (authError || !authData.user?.id) {
        console.error('❌ Auth signup error:', authError?.message);
        setLoading(false);
        return { error: authError?.message || 'Failed to create account' };
      }

      console.log('✅ Auth user created:', authData.user.id);

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username,
          password_hash: 'demo_hash',
          full_name: fullName,
          age,
          gender
        });

      if (profileError) {
        console.error('❌ Profile creation error:', profileError.message);
        // Clean up auth user if profile creation fails
        await supabase.auth.signOut();
        setLoading(false);
        return { error: 'Failed to create user profile' };
      }

      console.log('✅ User profile created successfully');
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
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
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