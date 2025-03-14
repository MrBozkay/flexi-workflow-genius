
import React, { createContext, useContext, useState, useEffect } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Create mock session based on localStorage
    const checkMockAuth = () => {
      const mockUserStr = localStorage.getItem('mock_user');
      if (mockUserStr) {
        try {
          const mockUser = JSON.parse(mockUserStr);
          const mockSession = {
            access_token: 'mock-token',
            refresh_token: 'mock-refresh-token',
            expires_at: Date.now() + 3600000,
            user: mockUser
          };
          setSession(mockSession as Session);
          setUser(mockUser as User);
        } catch (e) {
          console.error('Error parsing mock user:', e);
          localStorage.removeItem('mock_user');
        }
      }
      setLoading(false);
    };

    // First, try to get a session from Supabase (for real implementation)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } else {
        // If no Supabase session, check for mock auth
        checkMockAuth();
      }
    }).catch(err => {
      console.log('Error checking Supabase session, fallback to mock:', err);
      checkMockAuth();
    });

    // For real implementation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    // Listen for changes to localStorage (for mock auth)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mock_user') {
        checkMockAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const signOut = async () => {
    // Clear both real and mock auth
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.log('Error signing out of Supabase:', err);
    }
    
    // Clear mock auth
    localStorage.removeItem('mock_user');
    setSession(null);
    setUser(null);
    
    // Redirect to auth page
    window.location.href = '/auth';
  };

  const value = {
    session,
    user,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
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
