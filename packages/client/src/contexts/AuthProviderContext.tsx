// ============================================================
// e-Signature Prototype — AuthProvider Context
// ============================================================
//
// Provides the active AuthProvider (Password or SSO) app-wide.
// The IT Admin toggle (Phase 6) will call setAuthProvider to
// switch modes at runtime.
// ============================================================

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  AuthProvider,
  PasswordAuthProvider,
  MockSsoAuthProvider,
} from '../services/authProvider';

export type AuthMode = 'password' | 'sso';

interface AuthProviderContextType {
  /** The currently active auth provider instance. */
  authProvider: AuthProvider;
  /** The current mode label — useful for toggles / display. */
  authMode: AuthMode;
  /** Switch the app-wide auth mode. */
  setAuthMode: (mode: AuthMode) => void;
}

const AuthProviderContext = createContext<AuthProviderContextType | undefined>(undefined);

// Singleton instances so we don't recreate on every render
const passwordProvider = new PasswordAuthProvider();
const ssoProvider = new MockSsoAuthProvider('Okta');

export function AuthProviderProvider({ children }: { children: ReactNode }) {
  const [authMode, setAuthModeState] = useState<AuthMode>(() => {
    const stored = localStorage.getItem('authMode');
    return stored === 'sso' ? 'sso' : 'password';
  });

  const setAuthMode = (mode: AuthMode) => {
    setAuthModeState(mode);
    localStorage.setItem('authMode', mode);
  };

  const authProvider = useMemo<AuthProvider>(
    () => (authMode === 'sso' ? ssoProvider : passwordProvider),
    [authMode],
  );

  return (
    <AuthProviderContext.Provider value={{ authProvider, authMode, setAuthMode }}>
      {children}
    </AuthProviderContext.Provider>
  );
}

/**
 * Hook to access the current auth provider and mode switcher.
 * Must be used within an `AuthProviderProvider`.
 */
export function useAuthProvider() {
  const context = useContext(AuthProviderContext);
  if (context === undefined) {
    throw new Error('useAuthProvider must be used within an AuthProviderProvider');
  }
  return context;
}

