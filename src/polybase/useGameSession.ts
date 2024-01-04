import { useEffect, useState } from 'react';
import { getSession } from './SessionHandler';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from '../screens/SessionData';
import { Polybase } from "@polybase/client"
import { POLYBASE_NAMESPACE } from './PolybaseNamespace';
import { GameSession } from '../game-domain/GameSession'; // Import the Session type
import { isEqual } from 'lodash';

const COLLECTION_NAME = "GameSession";
const db = new Polybase({ defaultNamespace: POLYBASE_NAMESPACE });

function useGameSession() {
  const [session, setSession] = useState<GameSession>();
  const [sessionData] = useLocalStorageState<SessionData>('sessionData');
  
  const hasChanged = (before: any, after: any) => {
    return !isEqual(before, after);
  }

  const fetchSession = async () => {
    if (!sessionData?.sessionId) {
      return;
    }
    const newSession = await getSession({ id: sessionData?.sessionId });
    setSession(newSession);
  }

  useEffect(() => {
    if (!sessionData?.sessionId) {
      return;
    }
    
    const collectionReference = db.collection(COLLECTION_NAME).record(sessionData?.sessionId).onSnapshot(
      (newDoc) => {
        const new_session = newDoc.data;
        if (hasChanged(session, new_session)) {
          fetchSession();
        }
      },
      (err) => {
        // Optional error handler
      }
    );
      
    return () => {
      collectionReference();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData]); // Dependencies
    
  return session;
}

export default useGameSession;