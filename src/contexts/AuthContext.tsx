import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  age?: number;
  gender?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error?: string }>;
  signUp: (username: string, password: string, fullName: string, age?: number, gender?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('🔄 Starting auth initialization...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔄 Session check result:', { 
          hasSession: !!session, 
          userId: session?.user?.id || 'none',
          error: error?.message || 'none'
        });

        if (!mounted) return;

        if (error) {
          console.error('❌ Session error:', error.message);
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
          console.log('🔄 Finished auth init:', { user: null, session: null });
          return;
        }

        // We have a session, fetch user profile
        console.log('✅ Session found, fetching profile for:', session.user.id);
        setSession(session);
        
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!mounted) return;

        if (profileError) {
          console.error('❌ Profile fetch error:', profileError.message);
          setUser(null);
        } else {
          console.log('✅ Profile fetched successfully:', profile);
          setUser(profile);
        }

        setLoading(false);
        console.log('🔄 Finished auth init:', { user: !!profile, session: !!session });

      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Auth state changed:', event, { hasSession: !!session });
      
      setSession(session);
      
      if (session?.user?.id) {
        console.log('✅ New session, fetching profile...');
        
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (mounted) {
          if (error) {
            console.error('❌ Profile fetch error in state change:', error.message);
            setUser(null);
          } else {
            console.log('✅ Profile updated from state change:', profile);
            setUser(profile);
          }
          setLoading(false);
        }
      } else {
        console.log('❌ No session in state change, clearing user');
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      console.log('🔄 Attempting sign in for:', username);
      setLoading(true);
      
      const email = `${username}@eldercare.app`;
      console.log('🔄 Using email:', email);
      
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
      // Don't set loading to false here - let the auth state change handle it
      return {};
    } catch (error) {
      console.error('❌ Sign in exception:', error);
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (username: string, password: string, fullName: string, age?: number, gender?: string) => {
    try {
      console.log('🔄 Attempting sign up for:', username);
      setLoading(true);
      
      const email = `${username}@eldercare.app`;
      console.log('🔄 Creating auth user with email:', email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password: 'eldercare_password_2024'
      });
      
      if (authError || !authData.user?.id) {
        console.error('❌ Auth signup error:', authError?.message);
        setLoading(false);
        return { error: authError?.message || 'Signup failed' };
      }

      const userId = authData.user.id;
      console.log('✅ Auth user created, inserting profile for ID:', userId);

      const { error: profileError } = await supabase.from('users').insert({
        id: userId,
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
      // Don't set loading to false here - let the auth state change handle it
      return {};
    } catch (error) {
      console.error('❌ Sign up exception:', error);
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    console.log('🔄 Signing out...');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};