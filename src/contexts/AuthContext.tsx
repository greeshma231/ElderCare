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
        console.log('🔄 Initializing auth...');
        
        // Set a maximum timeout for initialization
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('⏰ Auth initialization timeout - proceeding without session');
            setLoading(false);
          }
        }, 3000); // 3 second timeout

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        clearTimeout(timeoutId);
        
        if (!mounted) return;

        if (error) {
          console.error('❌ Error getting session:', error);
          setLoading(false);
          return;
        }

        if (!session) {
          console.log('❌ No session found');
          setLoading(false);
          return;
        }

        console.log('✅ Session found:', session.user.id);
        setSession(session);
        await fetchUserProfile(session.user.id);
        
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Auth state changed:', event);
      
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
      console.error('❌ Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign in for username:', username);
      
      // Check if user exists in the database first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, full_name')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        console.log('❌ User not found in database');
        setLoading(false);
        return { error: 'Invalid username or password' };
      }

      // Create email from username for auth (consistent for all users)
      const email = `${username}@eldercare.app`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('❌ Auth sign in failed:', error);
        setLoading(false);
        return { error: 'Invalid username or password' };
      }

      console.log('✅ Sign in successful');
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

      // Create email from username
      const email = `${username}@eldercare.app`;

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('❌ Auth signup error:', error);
        setLoading(false);
        return { error: error.message };
      }

      if (!data?.user?.id) {
        console.error('❌ No user ID returned from auth signup');
        setLoading(false);
        return { error: 'Failed to create account' };
      }

      // Create user profile
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          username,
          password_hash: 'hashed_password',
          full_name: fullName,
          age,
          gender,
        });

      if (insertError) {
        console.error('❌ Error creating user profile:', insertError);
        await supabase.auth.signOut();
        setLoading(false);
        return { error: 'Failed to create user profile' };
      }

      console.log('✅ Sign up successful');
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
      setLoading(true);
      console.log('🔄 Signing out...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      console.log('✅ Signed out successfully');
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