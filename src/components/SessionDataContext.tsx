import React, { createContext, useState } from 'react';
import { SessionData } from '../screens/SessionData';

interface SessionDataType {
  sessionData: SessionData | null;
  setSessionData: (sessionData: SessionData) => void;
}

export const SessionDataContext = createContext<SessionDataType>({
  sessionData: null,
  setSessionData: () => { },
});

interface Props {
  children: React.ReactNode;
}

export const SessionDataProvider: React.FC<Props> = ({ children }) => {
  const [sessionData, setSessionData] = useState<any>(null);

  return (
    <SessionDataContext.Provider value={{ sessionData, setSessionData }}>
      {children}
    </SessionDataContext.Provider>
  );
};