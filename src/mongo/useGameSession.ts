import { useEffect, useRef } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from '../screens/SessionData';
import { GameSession } from '../game-domain/GameSession'; // Import the Session type
import SessionConnection from './SessionConnection';

function useGameSession(sessionId?: string) {
  const currentSessionRef = useRef<GameSession>();
  const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData');

  // useEffect(() => {
  //   setSessionData({ ...sessionData, sessionId: "mk-pbid-8f199b67-debc-4210-a327-43505d86a91d" })
  // });

  useEffect(() => {
    if (!sessionData?.sessionId && !sessionId) {
      return;
    }

    const watchCollection = async () => {
      if (!sessionData?.sessionId && !sessionId) return;

      // watch for changes to the session
      SessionConnection.watchSession(sessionData?.sessionId ?? sessionId ?? "", (session: GameSession) => {
        // console.log("session", session);
        currentSessionRef.current = session;
      });
      
    };

    watchCollection();
    return () => {
      SessionConnection.stopWatchingSession()
    };

  }, [sessionData, sessionId]); // Dependencies

  return currentSessionRef.current as GameSession;
}



export default useGameSession;