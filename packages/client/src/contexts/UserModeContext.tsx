import { createContext, useContext, useState, ReactNode } from 'react';

export type UserMode = 'scientist' | 'it' | null;

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  toggleUserMode: () => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [userMode, setUserModeState] = useState<UserMode>(() => {
    const stored = localStorage.getItem('userMode');
    return (stored === 'scientist' || stored === 'it') ? stored : null;
  });

  const setUserMode = (mode: UserMode) => {
    setUserModeState(mode);
    if (mode) {
      localStorage.setItem('userMode', mode);
    } else {
      localStorage.removeItem('userMode');
    }
  };

  const toggleUserMode = () => {
    setUserMode(userMode === 'scientist' ? 'it' : 'scientist');
  };

  return (
    <UserModeContext.Provider value={{ userMode, setUserMode, toggleUserMode }}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
}

