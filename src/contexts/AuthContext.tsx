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
        
        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('❌ Error getting session:', error);
          setUser(null);
          setLoading(false);
          return;
        }

        if (!session) {
          console.log('❌ No session found, showing login');
          setUser(null);
          setLoading(false);
          return;
        }

        console.log('✅ Session found:', session.user.id);
        setSession(session);
        await fetchUserProfile(session.user.id);
        
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setUser(null);
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
      
      // Add retry logic with exponential backoff
      let retries = 3;
      let delay = 500;
      
      while (retries > 0) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully

        if (error) {
          console.error('❌ Error fetching user profile:', error);
          retries--;
          if (retries > 0) {
            console.log(`🔄 Retrying in ${delay}ms... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
            continue;
          }
          setUser(null);
          break;
        }

        if (data) {
          console.log('✅ User profile fetched:', data);
          setUser(data);
          break;
        } else {
          console.log('⚠️ No user profile found, creating one...');
          // If no profile exists, create a basic one
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              id: userId,
              email: `user-${userId}@eldercare.app`,
              username: `user-${Date.now()}`,
              full_name: 'New User'
            })
            .select()
            .single();

          if (createError) {
            console.error('❌ Error creating user profile:', createError);
            setUser(null);
          } else {
            console.log('✅ User profile created:', newUser);
            setUser(newUser);
          }
          break;
        }
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
      
      // First, check if this user exists in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, full_name, email')
        .eq('username', username)
        .maybeSingle();

      if (userError) {
        console.error('❌ Error checking user:', userError);
        setLoading(false);
        return { error: 'Database error occurred' };
      }

      if (!userData) {
        console.log('❌ User not found in database');
        setLoading(false);
        return { error: 'Invalid username or password' };
      }

      console.log('✅ Found user in database:', userData);

      // Use the email from the database record
      const email = userData.email;
      
      // Try to sign in with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: 'eldercare_password_2024', // Fixed password for demo
      });

      if (authError) {
        console.error('❌ Auth sign in failed:', authError);
        setLoading(false);
        return { error: 'Invalid username or password' };
      }

      console.log('✅ Sign in successful');
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
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Error checking existing user:', checkError);
        setLoading(false);
        return { error: 'Database error occurred' };
      }

      if (existingUser) {
        console.log('❌ Username already exists');
        setLoading(false);
        return { error: 'Username already exists' };
      }

      // Create email from username for consistent auth
      const email = `${username}@eldercare.app`;

      console.log('🔄 Creating auth user with email:', email);

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
          id: data.user.id,
          email,
          username,
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