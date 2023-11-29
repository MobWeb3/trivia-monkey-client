// useGameBoardState.ts
import { useState } from 'react';
import { getSession } from './SessionHandler';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from '../screens/SessionData';
import { Polybase } from "@polybase/client"
import { POLYBASE_NAMESPACE } from './PolybaseNamespace';
import { GameBoardState } from '../game-domain/Session';
import { isEqual } from 'lodash';

const db = new Polybase({ defaultNamespace: POLYBASE_NAMESPACE });
const COLLECTION_NAME = "GameSession";

function useGameBoardState() {
  const [gameBoardState, setGameBoardState] = useState<GameBoardState>({});
  const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});

  const hasChanged = (before: any, after: any) => {
    return !isEqual(before, after);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const collectionReference = db.collection(COLLECTION_NAME).record(sessionData?.sessionId ?? '').onSnapshot(
    (newDoc) => {

      async function fetchGameBoardState() {
        const session = await getSession({ id: sessionData?.sessionId });
        setGameBoardState(session.gameBoardState);
      }

      // console.log('newDoc: ', newDoc);
      const { gameBoardState: newGameBoardState } = newDoc.data;
      // console.log('newUpdate!!: ', newGameBoardState);
      if (hasChanged(gameBoardState, newGameBoardState)) {
        fetchGameBoardState();
      }
    },
    (err) => {
      // Optional error handler
    }
  );

  return gameBoardState;
}

export default useGameBoardState;