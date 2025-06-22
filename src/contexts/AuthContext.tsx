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

  const fetchUserProfile = async (id: string) => {
    try {
      console.log('🔄 Fetching user profile for ID:', id);
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
      
      if (error) {
        console.error('❌ Error fetching profile:', error.message);
        setUser(null);
      } else {
        console.log('✅ Profile fetched successfully:', data);
        setUser(data);
      }
    } catch (error) {
      console.error('❌ Exception fetching profile:', error);
      setUser(null);
    } finally {
      console.log('🏁 Setting loading to false after profile fetch');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 Starting auth initialization...');
    
    const init = async () => {
      try {
        console.log('🔄 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔄 Session check result:', { session: !!session, error });
        
        if (error) {
          console.error('❌ Session error:', error);
          setUser(null);
          setSession(null);
          setLoading(false);
          return;
        }
        
        if (session) {
          console.log('✅ Session found, fetching profile...');
          setSession(session);
          await fetchUserProfile(session.user.id);
        } else {
          console.log('❌ No session found, user needs to login');
          setUser(null);
          setSession(null);
          setLoading(false);
        }
        
        console.log('🔄 Finished auth init:', { user: !!user, session: !!session });
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setUser(null);
        setSession(null);
        setLoading(false);
      }
    };

    init();

    console.log('🔄 Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, { session: !!session });
      
      setSession(session);
      
      if (session?.user?.id) {
        console.log('✅ New session, fetching profile...');
        await fetchUserProfile(session.user.id);
      } else {
        console.log('❌ No session in state change, clearing user');
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('🔄 Cleaning up auth subscription');
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
        password: 'eldercare_password_2024' // Fixed password for demo
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
      console.log('🔄 Attempting sign up for:', username);
      setLoading(true);
      
      const email = `${username}@eldercare.app`;
      console.log('🔄 Creating auth user with email:', email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password: 'eldercare_password_2024' // Fixed password for demo
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
        password_hash: 'demo_hash', // Required field
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