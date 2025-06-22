import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  age?: number;
  gender?: string;
  primary_caregiver?: string;
}

interface AuthContextType {
  user: User | null;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('⏰ Auth initialization timeout, showing login');
            setUser(null);
            setLoading(false);
          }
        }, 5000); // 5 second timeout

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        clearTimeout(timeoutId);
        
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
        await fetchUserProfile(session.user.id, session.user.email);
        
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Auth state changed:', event);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email);
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

  const fetchUserProfile = async (userId: string, userEmail?: string) => {
    try {
      console.log('🔄 Fetching user profile for:', userId);
      
      // Use maybeSingle() instead of single() to handle cases where no profile exists
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        setUser(null);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('✅ User profile fetched:', data);
        setUser(data);
        setLoading(false);
      } else {
        console.log('🔄 No user profile found, creating default profile...');
        
        // Create a default profile for the authenticated user
        const email = userEmail || `user-${userId}@eldercare.app`;
        const username = email.split('@')[0];
        
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: email,
            username: username,
            full_name: username.charAt(0).toUpperCase() + username.slice(1),
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error creating default user profile:', insertError);
          setUser(null);
        } else {
          console.log('✅ Default user profile created:', newProfile);
          setUser(newProfile);
        }
        
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      setUser(null);
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign in for username:', username);
      
      // For demo user, use fixed credentials
      if (username === 'shelly' && password === 'password123') {
        // Create email from username
        const email = `${username}@eldercare.app`;
        
        console.log('🔄 Signing in with email:', email);
        
        // Try to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'eldercare_demo_2024', // Fixed demo password
        });

        if (error) {
          console.log('🔄 Auth user not found, creating demo auth account...');
          
          // Create auth user for demo
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password: 'eldercare_demo_2024',
          });

          if (signUpError) {
            console.error('❌ Failed to create demo auth account:', signUpError);
            setLoading(false);
            return { error: 'Authentication failed' };
          }

          console.log('✅ Demo auth account created');
        }

        console.log('✅ Sign in successful');
        return {};
      } else {
        console.log('❌ Invalid demo credentials');
        setLoading(false);
        return { error: 'Invalid username or password. Use demo credentials: shelly / password123' };
      }
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

      console.log('🔄 Creating auth user with email:', email);

      // Create Supabase auth user
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
        return { error: 'Failed to create authentication account' };
      }

      console.log('✅ Auth user created:', data.user.id);

      // Insert user profile
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
    } catch (error) {
      console.error('❌ Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};