import { createContext, useContext, useState, ReactNode } from 'react';

interface ToolbarContextType {
  rightActions: ReactNode;
  setRightActions: (actions: ReactNode) => void;
}

const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export function ToolbarProvider({ children }: { children: ReactNode }) {
  const [rightActions, setRightActions] = useState<ReactNode>(null);

  return (
    <ToolbarContext.Provider value={{ rightActions, setRightActions }}>
      {children}
    </ToolbarContext.Provider>
  );
}

export function useToolbar() {
  const context = useContext(ToolbarContext);
  if (context === undefined) {
    throw new Error('useToolbar must be used within a ToolbarProvider');
  }
  return context;
}

