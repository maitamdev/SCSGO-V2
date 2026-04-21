import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Record<string, unknown> | null;
  isLoading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, displayName: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .maybeSingle();
      setProfile(data);
    } catch (e) {
      console.error('Load profile error:', e);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadProfile(s.user.id);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        loadProfile(s.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(parseError(authError.message));
        setIsLoading(false);
        return false;
      }
      setUser(data.user);
      if (data.user) await loadProfile(data.user.id);
      setIsLoading(false);
      return true;
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      setIsLoading(false);
      return false;
    }
  };

  const signUp = async (email: string, password: string, displayName: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: displayName } },
      });
      if (authError) {
        setError(parseError(authError.message));
        setIsLoading(false);
        return false;
      }
      setUser(data.user);
      setIsLoading(false);
      return !!data.user;
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      setIsLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const clearError = () => setError(null);

  const parseError = (msg: string): string => {
    switch (msg) {
      case 'Invalid login credentials': return 'Email hoặc mật khẩu không đúng';
      case 'Email not confirmed': return 'Vui lòng xác nhận email trước khi đăng nhập';
      case 'User already registered': return 'Email này đã được đăng ký';
      default: return msg;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, error, signInWithEmail, signUp, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
