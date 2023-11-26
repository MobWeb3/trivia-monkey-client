// useGameBoardState.ts
import { useState } from 'react';
import { getSession } from './SessionHandler';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from '../screens/SessionData';
import { Polybase } from "@polybase/client"
import { POLYBASE_NAMESPACE } from './PolybaseNamespace';
import { GameBoardState } from '../game-domain/Session';

const db = new Polybase({ defaultNamespace: POLYBASE_NAMESPACE });
const COLLECTION_NAME = "GameSession";

function useGameBoardState() {
  const [gameBoardState, setGameBoardState] = useState<GameBoardState>({});
  const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});

  /* Check if gameBoardState is updated  or is empty*/
  const hasChanged = (before: any, after: any) => {
    // console.log('before: ', before);
    // console.log('after: ', after);
    if (before === undefined || before === null || Object.keys(before).length === 0) {
      return true;
    }

    // do a deep comparison for all keys
    for (const key in before) {
      if (before[key] !== after[key]) {
        return true;
      }
    }

    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const collectionReference = db.collection(COLLECTION_NAME).onSnapshot(
    (newDoc) => {

      async function fetchGameBoardState() {
        const session = await getSession({ id: sessionData?.sessionId });
        setGameBoardState(session.gameBoardState);
      }

      // console.log('newDoc: ', newDoc);
      const { gameBoardState: newGameBoardState } = newDoc.data[0].data;
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