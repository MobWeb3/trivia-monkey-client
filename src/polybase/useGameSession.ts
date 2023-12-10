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

function useGameSession(customId?: string) {
  const [session, setSession] = useState<GameSession>({});
  const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData');

  const hasChanged = (before: any, after: any) => {
    return !isEqual(before, after);
  }

  useEffect(() => {

    if (customId) {
      setSessionData({...sessionData, sessionId: customId })
    }

    if (!sessionData?.sessionId) {
      return;
    }

    const collectionReference = db.collection(COLLECTION_NAME).record(sessionData?.sessionId).onSnapshot(
      (newDoc) => {
        async function fetchSession() {
          const newSession = await getSession({ id: sessionData?.sessionId });
          setSession(newSession);
        }
  
        const new_session = newDoc.data;
        // console.log('old session', session);
        // console.log('newSession', new_session);
        if (hasChanged(session, new_session)) {
          // console.log('session changed: session data', sessionData);
          fetchSession();
        }
      },
      (err) => {
        // Optional error handler
      }
    );
  
    // console.log("sessionData", sessionData);
    return () => {
      collectionReference();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, sessionData]); // Dependencies
  
  return session;
}

export default useGameSession;