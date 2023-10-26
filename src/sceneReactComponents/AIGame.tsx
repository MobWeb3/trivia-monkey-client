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

import wheelImage from './../assets/spinners/spinner-test.png';
import pinImage from './../assets/sprites/pin.png';
// import playerImage from './../assets/sprites/monkey-avatar.png';
import { motion } from 'framer-motion';
import { GameSession } from '../game-domain/GameSession';
import { SessionPhase } from '../game-domain/SessionPhase';



function AIGame() {

    const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [chosenTopic, setChosenTopic] = useState<string | null>(null);

    const [canSpin, setCanSpin] = useState(true);
    const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
    const [message, setMessage] = useState("Loading...");
    const [rotationDegrees, setRotationDegrees] = useState(0);
    const [hasSpun, setHasSpun] = useState(false);
    const [sliceValues, setSliceValues] = useState<string[]>([]);
    const NUM_SLICES = 6;
    const [session, setSession] = useState<GameSession | null>(null);


    const handleShowQuestion = async (topic:string) => {

        if (!sessionData?.questionSessionId) {
            const { questionSessionId } = await getSession({ id: sessionData?.sessionId })
            setSessionData({ ...sessionData, questionSessionId });
        }

        console.log(`topic ${topic}, questionSessionId ${sessionData?.questionSessionId}`);
        const question: Question = await getQuestion({id:sessionData?.questionSessionId, topic});

        console.log('question', question);
        setCurrentQuestion(question);
        setShowQuestionModal(true);
        setChosenTopic(topic);
    }
    
    const finishTurnAndSaveState = async () => {
        setShowQuestionModal(false);
        // Update turn on polybase
        const {nextTurnPlayerId} = await getNextTurnPlayerId({id: sessionData?.sessionId});
        // Publish turn completed // we know clientId is not null because we checked isPlayerTurn
        if(sessionData?.clientId && sessionData.channelId) {
            await publishTurnCompleted(sessionData?.clientId, sessionData.channelId, {nextTurnPlayerId});
        } 
    }

    useEffect(() => {
        console.log('AIGame loaded: ', sessionData);
        setupSessionData();
    }, [sessionData?.sessionId]);

    useEffect(() => {
        if (sessionData?.clientId && sessionData?.channelId){
            suscribeToTurnCompleted(sessionData?.clientId, sessionData?.channelId);
        }

        const handleTurnCompleted = async (event: any) => {
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

    useEffect(() => {
        if (hasSpun && selectedSlice) {
          setMessage(`Selected slice: ${selectedSlice}`);
          handleShowQuestion(selectedSlice)
        }
    }, [hasSpun, selectedSlice]);

    async function updateTurn(expectedCurrentPlayerId: string) {
        await updateSessionData(expectedCurrentPlayerId);
        // this.updatedPlayerInTurnAvatar();
    }

    const spin = async () => {
        if (canSpin) {
            setMessage("Spinning...");
            const minRounds = 2;
            const maxRounds = 4;
            const rounds = Math.floor(Math.random() * (maxRounds - minRounds + 1)) + minRounds;
            const fullCircleDegrees = 360;
            const sliceDegree = fullCircleDegrees / NUM_SLICES;
            const randomOffset = Math.random() * sliceDegree; // random offset within a slice

            const degrees = (Math.floor(Math.random() * NUM_SLICES) * sliceDegree + randomOffset) % fullCircleDegrees;
            const selected = sliceValues[Math.round(degrees / sliceDegree) % NUM_SLICES];
            setSelectedSlice(selected);
            setCanSpin(false);

            // Calculate total degrees to rotate
            const totalDegrees = fullCircleDegrees + degrees;
            setRotationDegrees(totalDegrees);

            // Wait for spinning animation to complete
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Adjust the duration as needed
            

            // Call handleSelectedSlice after spinning is complete
            setHasSpun(true);
            // setMessage(`Selected slice: ${selectedSlice}`);

            // if (selectedSlice) await 
        }
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
        const { topics, currentTurnPlayerId } = session;

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
            const session:GameSession = await pollUntilSessionChanges(expectedCurrentPlayerId, sessionData?.sessionId ?? '');
            if (!session) return;
            setSession(session);

            const {topics} = session;
             // Get topics
            setSliceValues(topics as unknown as string[]);
            // this.session.gamePhase = gamePhase ?? {};

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
            <motion.div 
                onClick={spin}
                animate={{ rotate: `${rotationDegrees}deg` }}
                transition={{ duration: 3, ease: "easeOut"}}
                style={{ transformOrigin: "center", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                {sliceValues.map((sliceValue, index) => {
                    const sliceAngle = (360 / NUM_SLICES) * index;
                    return <Slice key={index} sliceValue={sliceValue} angle={sliceAngle} />;
                })}
                <img src={wheelImage} alt="Wheel" style={{ objectFit: "fill" }} />
            </motion.div>
            <img src={pinImage} alt="Pin" style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)' }} />

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
                // if (!session) {
                //     console.log('session not initialized yet');
                //     this.messageGameText?.setText("session not initialized yet");
                // }
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

type SliceProps = {
    sliceValue: string;
    angle: number;
};

// Slice Component
const Slice = ({ sliceValue, angle }: SliceProps) => {
    return (
        <div style={{
            position: 'absolute',
            transform: `rotate(${angle}deg) translate(150px) rotate(-${angle}deg)`, // Adjust the translate value based on your wheel's radius
            textAlign: 'center',
            // Add additional styling as needed
        }}>
            {sliceValue}
        </div>
    );
};