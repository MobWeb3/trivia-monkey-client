import { GameSession } from "../game-domain/GameSession";
import { getSession } from "./SessionHandler";

export function pollForCurrentPlayerId(sessionId: string): Promise<any> {
    let tries = 0; // Initialize tries counter
    const maxTries = 3; // Set maximum number of tries
    return new Promise(async (resolve, reject) => {
        const intervalId = setInterval(async () => {

            try {
                console.log("polling for session id: ", sessionId);
                // Get session data
                const session = await getSession({ id: sessionId });
                const { currentTurnPlayerId } = session;

                // If currentTurnPlayerId is not null, clear the interval and resolve the Promise
                if (currentTurnPlayerId) {
                    clearInterval(intervalId);
                    resolve(session);
                }
            } catch (error) {
                console.log("error polling for current player id: ", error);
            }


            // If maximum number of tries has been reached, clear the interval and reject the Promise
            if (++tries >= maxTries) {
                clearInterval(intervalId);
                reject('Timeout: Maximum number of tries reached');
            }
        }, 2000); // 1000 ms = 1 second
    });
}

export function pollUntilSessionChanges(expectedCurrentPlayerId: string, sessionId: string): Promise<GameSession> {

    return new Promise(async (resolve, reject) => {
        let tries = 0; // Initialize tries counter
        const maxTries = 3; // Set maximum number of tries
        const intervalId = setInterval(async () => {
            // Get new session data
            try {
                const newSession = await getSession({ id: sessionId });
                // if (!newSession) {
                //     console.log('session not initialized yet');
                //     this.messageGameText?.setText("session not initialized yet");
                // }

                if (expectedCurrentPlayerId === newSession.currentTurnPlayerId) {
                    clearInterval(intervalId);
                    resolve(newSession);
                }
            } catch (error) {
                console.log("error polling for session changes: ", error);
            }

            // If maximum number of tries has been reached, clear the interval and reject the Promise
            if (++tries >= maxTries) {
                clearInterval(intervalId);
                reject('Timeout: Maximum number of tries reached');
            }
        }, 2000); // 1000 ms = 1 second
    });
}