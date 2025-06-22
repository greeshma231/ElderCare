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
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) {
      console.error('❌ Error fetching profile:', error.message);
      setUser(null);
    } else {
      setUser(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setSession(null);
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    const email = `${username}@eldercare.app`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      return { error: error.message };
    }
    return {};
  };

  const signUp = async (username: string, password: string, fullName: string, age?: number, gender?: string) => {
    setLoading(true);
    const email = `${username}@eldercare.app`;
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError || !authData.user?.id) {
      setLoading(false);
      return { error: authError?.message || 'Signup failed' };
    }

    const userId = authData.user.id;

    const { error: profileError } = await supabase.from('users').insert({
      id: userId,
      username,
      full_name: fullName,
      age,
      gender
    });

    if (profileError) {
      await supabase.auth.signOut();
      setLoading(false);
      return { error: profileError.message };
    }

    return {};
  };

  const signOut = async () => {
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
