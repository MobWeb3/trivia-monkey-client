import { useState } from 'react';
import { getSession } from './SessionHandler';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from '../screens/SessionData';
import { Polybase } from "@polybase/client"
import { POLYBASE_NAMESPACE } from './PolybaseNamespace';
import { GameSession } from '../game-domain/GameSession'; // Import the Session type
import { isEqual } from 'lodash';

const db = new Polybase({ defaultNamespace: POLYBASE_NAMESPACE });
const COLLECTION_NAME = "GameSession";

function useGameSession() {
  const [session, setSession] = useState<GameSession>({});
  const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});

  const hasChanged = (before: any, after: any) => {
    return !isEqual(before, after);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ds = db.collection(COLLECTION_NAME).onSnapshot(
    (newDoc) => {
      async function fetchSession() {
        const newSession = await getSession({ id: sessionData?.sessionId });
        setSession(newSession);
      }

      console.log('newDoc', newDoc);
      const new_session = newDoc.data[0].data;
      // console.log('newSession', new_session);
      if (hasChanged(session, new_session)) {
        console.log('session changed: session data', sessionData);
        fetchSession();
      }
    },
    (err) => {
      // Optional error handler
    }
  );
  return session;
}

export default useGameSession;