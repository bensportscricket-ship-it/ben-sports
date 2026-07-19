import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's role from the `profiles` table.
  // The role NEVER comes from localStorage or from anything the client
  // sent at signup — it is only ever read back from the database, where
  // it can only be changed by an admin (see supabase/schema.sql RLS rules).
  const loadProfile = async (currentSession) => {
    if (!currentSession?.user) {
      setRole(null);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentSession.user.id)
      .single();

    if (error) {
      console.error('Failed to load profile role:', error.message);
      setRole('member');
    } else {
      setRole(data?.role ?? 'member');
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Get whatever session already exists (page refresh, etc.)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      await loadProfile(session);
      setLoading(false);
    });

    // Keep session + role in sync with real Supabase auth events
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setLoading(true);
      await loadProfile(newSession);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user: session?.user ?? null,
    role, // 'member' | 'team_admin' | 'super_admin' | null
    loading,
    signOut,
    isSuperAdmin: role === 'super_admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
