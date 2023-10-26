import './SpinWheel.css';
import '../sceneConfigs/AIGameConfig';
import { useEffect, useState } from 'react';
import QuestionModal from '../components/QuestionModal';
import { getQuestion } from '../polybase/QuestionsHandler';
import { Question } from '../game-domain/Question';
import { addMessageListener, removeMessageListener } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';
import { Button } from '@mantine/core';
import { getNextTurnPlayerId, getSession } from '../polybase/SessionHandler';
import { publishTurnCompleted, suscribeToTurnCompleted } from '../ably/AblyMessages';
import { SessionData } from './SessionData';
import useLocalStorageState from 'use-local-storage-state';

// import playerImage from './../assets/sprites/monkey-avatar.png';
import { GameSession } from '../game-domain/GameSession';
import { SessionPhase } from '../game-domain/SessionPhase';
import { Wheel } from 'react-custom-roulette'
import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';

function AIGame() {

    const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [chosenTopic, setChosenTopic] = useState<string | null>(null);

    const [canSpin, setCanSpin] = useState(false);
    const [message, setMessage] = useState("Loading...");
    const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
    const [sliceValues, setSliceValues] = useState<string[]>([]);
    const [session, setSession] = useState<GameSession | null>(null);

    const handleShowQuestion = async (topic: string) => {

        if (!sessionData?.questionSessionId) {
            const { questionSessionId } = await getSession({ id: sessionData?.sessionId })
            setSessionData({ ...sessionData, questionSessionId });
        }

        console.log(`topic ${topic}, questionSessionId ${sessionData?.questionSessionId}`);
        const question: Question = await getQuestion({ id: sessionData?.questionSessionId, topic });

        console.log('question', question);
        setCurrentQuestion(question);
        setChosenTopic(topic);

        // Wait for spinning animation to complete
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Adjust the duration as needed

        setShowQuestionModal(true);
    }

    const finishTurnAndSaveState = async () => {
        setShowQuestionModal(false);
        // Update turn on polybase
        const { nextTurnPlayerId } = await getNextTurnPlayerId({ id: sessionData?.sessionId });
        // Publish turn completed // we know clientId is not null because we checked isPlayerTurn
        if (sessionData?.clientId && sessionData.channelId) {
            await publishTurnCompleted(sessionData?.clientId, sessionData.channelId, {nextTurnPlayerId});
        }
    }

    useEffect(() => {
        console.log('AIGame loaded: ', sessionData);
        setupSessionData();
    }, [sessionData?.sessionId]);

    useEffect(() => {
        if (sessionData?.clientId && sessionData?.channelId) {
            suscribeToTurnCompleted(sessionData?.clientId, sessionData?.channelId);
        }

        const handleTurnCompleted = async (event: any) => {
            console.log("event detail: ", event.detail)
            const { nextTurnPlayerId } = event.detail;
            await updateTurn(nextTurnPlayerId);
        };

        window.addEventListener(Messages.TURN_COMPLETED, handleTurnCompleted);
        // Return cleanup function
        return () => {
            window.removeEventListener(Messages.TURN_COMPLETED, handleTurnCompleted);
        };
    }, [sessionData?.clientId, sessionData?.channelId]);

    useEffect(() => {
        addMessageListener(Messages.HIDE_QUESTION, finishTurnAndSaveState);
        return () => {
            // removeMessageListener(Messages.SHOW_QUESTION, showQuestion);
            removeMessageListener(Messages.HIDE_QUESTION, finishTurnAndSaveState)
        };
    });

    useEffect(() => {
        if (session) {
            if (isPlayerTurn()) {
                setCanSpin(true);
                setMessage("Your turn!");
            } else {
                setCanSpin(false);
                setMessage(`Waiting for ${session.currentTurnPlayerId} to finish turn...`);
            }
        }
    }, [session]);

    async function updateTurn(expectedCurrentPlayerId: string) {
        await updateSessionData(expectedCurrentPlayerId);
        // this.updatedPlayerInTurnAvatar();
    }


    function isPlayerTurn(): boolean {
        console.log('isPlayerTurn: ', sessionData?.clientId, session?.currentTurnPlayerId);
        if (!sessionData?.clientId || !session?.currentTurnPlayerId)
            return false;
        return sessionData.clientId === session.currentTurnPlayerId;
    }

    const setupSessionData = async () => {

        if (!sessionData?.sessionId) return;
        const session = await pollForCurrentPlayerId(sessionData?.sessionId);
        if (!session) return;
        setSession(session);
        // Get session data
        const { topics } = session;

        console.log('topics: ', topics)

        // Get topics
        setSliceValues(topics as unknown as string[]);

        // Check if game is active
        if (session.gamePhase !== SessionPhase.GAME_ACTIVE) {
            console.log('Game is not active!');
            // tell page to show that game has not started yet or is over.
            return;
        }
    }

    async function updateSessionData(expectedCurrentPlayerId: string) {
        console.log("current session:", session);

        if (!session || !session.id) return;

        try {
            const session: GameSession = await pollUntilSessionChanges(expectedCurrentPlayerId, sessionData?.sessionId ?? '');
            if (!session) return;
            setSession(session);

            const { topics } = session;
            // Get topics
            setSliceValues(topics as unknown as string[]);

            // Check if game is active
            if (session.gamePhase !== SessionPhase.GAME_ACTIVE) {
                console.log('Game is not active!');
                // tell page to show that game has not started yet or is over.
                return;
            }

        } catch (error) {
            console.log("error updating session data: ", error);
        }
    }
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const data: WheelData[] = (session?.topics ?? [])?.map((topic, index) => {
        // console.log(`topic: ${topic} index:${index}`) 
        return {
          option: topic,
          style: {
            backgroundColor: index % 2 ? 'green' : 'white',
            textColor: 'black',
          },
        };
      });

    const handleSpinClick = () => {
        console.log("data: ", data)
        if (!mustSpin) {
          const newPrizeNumber = Math.floor(Math.random() * (6));
          setPrizeNumber(newPrizeNumber);
          setMustSpin(true);
        }
    }

    return (
        <div style={{ position: 'relative' }}>
            <Button onClick={() => handleShowQuestion("Music")}>
                Show Question
            </Button>
            <QuestionModal
                open={showQuestionModal}
                onClose={() => finishTurnAndSaveState()}
                question={currentQuestion}
                topic={chosenTopic}
                onExpire={() => finishTurnAndSaveState()}
            />


        <p style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', color: 'black', fontWeight: 'bold' }}>{message}</p>
        <p style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', color: 'black', fontWeight: 'bold' }}>{selectedSlice}</p>
        {data && data.length > 0 && (
            <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                onStopSpinning={() => {
                    setMustSpin(false);
                    setSelectedSlice(sliceValues[prizeNumber])
                }}
                // other props and methods
            />
        )}
      { canSpin && <button onClick={handleSpinClick}>SPIN</button>}
        </div>

    );
}

function pollForCurrentPlayerId(sessionId: string): Promise<any> {
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

function pollUntilSessionChanges(expectedCurrentPlayerId: string, sessionId: string): Promise<GameSession> {

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

export default AIGame;