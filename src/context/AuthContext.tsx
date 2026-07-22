import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  school_id: string;
  branch_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  avatar: string | null;
  role: string; // SYSTEM_SUPER_ADMIN, SCHOOL_SUPER_ADMIN, ADMIN, BRANCH_MANAGER, INSTRUCTOR, RECEPTIONIST, ACCOUNTANT
  status: string;
  created_at: string;
}

export interface School {
  id: string;
  school_name: string;
  slug: string;
  email: string;
  phone: string;
  logo: string | null;
  address: string | null;
  subscription_plan: string;
  status: string;
  created_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  school: School | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (
    fullName: string,
    schoolName: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to load profile and school details
  const fetchProfileAndSchool = async (authUserId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (profile) {
        setUser(profile);

        const { data: schoolData, error: schoolError } = await supabase
          .from('schools')
          .select('*')
          .eq('id', profile.school_id)
          .single();

        if (schoolError) {
          throw schoolError;
        }

        if (schoolData) {
          setSchool(schoolData);
          // Mirror to localStorage for backwards compatibility with existing UI if needed
          localStorage.setItem('drivesiksha_school_name', schoolData.school_name);
        }
      }
    } catch (err: any) {
      console.error('Error fetching profile or school:', err.message);
      // Clean state if profile retrieval fails (might be signup pending email verification)
      setUser(null);
      setSchool(null);
    }
  };

  const refreshProfile = async () => {
    if (session?.user?.id) {
      await fetchProfileAndSchool(session.user.id);
    }
  };

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfileAndSchool(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          await fetchProfileAndSchool(currentSession.user.id);
        } else {
          setUser(null);
          setSchool(null);
          localStorage.removeItem('drivesiksha_school_name');
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to sign in');
      }

      // Initialize session on frontend Supabase client
      const { error } = await supabase.auth.setSession({
        access_token: resData.session.access_token,
        refresh_token: resData.session.refresh_token,
      });

      if (error) throw error;

      toast.success('Successfully logged in!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    fullName: string,
    schoolName: string,
    email: string,
    phone: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, schoolName, email, phone, password, agreed: true }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to register');
      }

      toast.success('Registration successful! Please check your email for verification.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to register school.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const token = session?.access_token;
      if (token) {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSchool(null);
      toast.success('Logged out successfully');
    } catch (err: any) {
      toast.error(err.message || 'Error signing out.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to request reset');
      }

      toast.success('Password reset link sent to your email.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to request reset.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    try {
      const token = session?.access_token;
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to update password');
      }

      toast.success('Password updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        school,
        isAuthenticated: !!session?.user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
