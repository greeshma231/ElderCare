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
        console.log('🔄 Starting auth initialization...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔄 Session check result:', { session: !!session, error });
        
        if (!mounted) {
          console.log('⚠️ Component unmounted, stopping auth init');
          return;
        }

        if (error) {
          console.error('❌ Error getting session:', error);
          setUser(null);
          setSession(null);
          setLoading(false);
          return;
        }

        if (!session) {
          console.log('❌ No session found, user needs to login');
          setUser(null);
          setSession(null);
          setLoading(false);
          return;
        }

        console.log('✅ Session found, fetching user profile...');
        setSession(session);
        await fetchUserProfile(session.user.id);
        
      } catch (error) {
        console.error('❌ Error in auth initialization:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    };

    // Start initialization immediately
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Auth state changed:', event, session?.user?.id || 'No user');
      
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
      console.log('🔄 Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        setUser(null);
      } else {
        console.log('✅ User profile fetched:', data);
        setUser(data);
      }
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error);
      setUser(null);
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign in for username:', username);
      
      // Create email from username for consistent auth
      const email = `${username}@eldercare.app`;
      
      // Try to sign in with Supabase auth using fixed password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: 'eldercare_password_2024', // Fixed password for demo
      });

      if (authError) {
        console.log('❌ Auth error:', authError.message);
        setLoading(false);
        return { error: 'Invalid username or password' };
      }

      console.log('✅ Sign in successful');
      // Don't set loading to false here - let the auth state change handler do it
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

      // Create email from username for consistent auth
      const email = `${username}@eldercare.app`;

      console.log('🔄 Creating auth user...');

      // Step 1: Create Supabase auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'eldercare_password_2024', // Fixed password for demo
      });

      if (error) {
        console.error('❌ Auth signup error:', error);
        setLoading(false);
        return { error: error.message };
      }

      if (!data?.user?.id) {
        console.error('❌ No user ID returned from auth signup');
        setLoading(false);
        return { error: 'Failed to create authentication account' };
      }

      console.log('✅ Auth user created:', data.user.id);

      // Step 2: Insert user profile using the authenticated user's ID
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id, // This is critical for RLS policy
          username,
          password_hash: 'hashed_password', // In production, hash the actual password
          full_name: fullName,
          age,
          gender,
        });

      if (insertError) {
        console.error('❌ Error creating user record:', insertError);
        // Clean up the auth user if profile creation fails
        await supabase.auth.signOut();
        setLoading(false);
        return { error: 'Failed to create user profile. Please try again.' };
      }

      console.log('✅ User profile created successfully');
      // Don't set loading to false here - let the auth state change handler do it
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
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('❌ Sign out error:', error);
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