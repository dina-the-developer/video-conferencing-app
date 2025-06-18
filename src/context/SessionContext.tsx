// context/SessionContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SessionPayload } from '@/lib/definitions';

interface SessionContextType {
  user: SessionPayload | null;
  setUser: React.Dispatch<React.SetStateAction<SessionPayload | null>>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({
  initialUser,
  children,
}: {
  initialUser: SessionPayload | null;
  children: ReactNode;
}) => {
  const [user, setUser] = useState(initialUser);

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
