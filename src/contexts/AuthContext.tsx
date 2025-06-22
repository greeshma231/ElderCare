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
    console.log('🔄 AuthProvider mounted, starting initialization...');
    
    // Simple initialization - just check session and set loading to false
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('📋 Initial session check:', { 
          hasSession: !!session, 
          userId: session?.user?.id || 'none',
          error: error?.message || 'none'
        });

        if (session?.user?.id) {
          console.log('✅ Found session, fetching user profile...');
          setSession(session);
          
          // Try to get user profile
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userData && !userError) {
            console.log('✅ User profile loaded:', userData.username);
            setUser(userData);
          } else {
            console.log('❌ No user profile found:', userError?.message);
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
        // ALWAYS set loading to false
        console.log('🏁 Setting loading to false');
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, !!session);
      
      setSession(session);
      
      if (session?.user?.id) {
        // Fetch user profile
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser(userData || null);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔄 Signing in:', username);
      
      const email = `${username}@eldercare.app`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'eldercare_password_2024'
      });

      if (error) {
        console.error('❌ Sign in error:', error.message);
        setLoading(false);
        return { error: error.message };
      }

      console.log('✅ Sign in successful');
      return {};
    } catch (error) {
      console.error('❌ Sign in exception:', error);
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (username: string, password: string, fullName: string, age?: number, gender?: string) => {
    try {
      setLoading(true);
      console.log('🔄 Signing up:', username);
      
      const email = `${username}@eldercare.app`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'eldercare_password_2024'
      });

      if (error || !data.user?.id) {
        console.error('❌ Auth signup error:', error?.message);
        setLoading(false);
        return { error: error?.message || 'Signup failed' };
      }

      console.log('✅ Auth user created, creating profile...');

      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          username,
          password_hash: 'demo_hash',
          full_name: fullName,
          age,
          gender
        });

      if (profileError) {
        console.error('❌ Profile creation error:', profileError.message);
        await supabase.auth.signOut();
        setLoading(false);
        return { error: profileError.message };
      }

      console.log('✅ Sign up successful');
      return {};
    } catch (error) {
      console.error('❌ Sign up exception:', error);
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