import './SpinWheel.css';
import '../sceneConfigs/AIGameConfig';
import { useEffect, useState } from 'react';
import QuestionModal from '../components/QuestionModal';
import { getQuestion } from '../polybase/QuestionsHandler';
import { Question } from '../game-domain/Question';
import { addMessageListener, removeMessageListener } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';
import { Button } from '@mantine/core';
import { getHostId, getNextTurnPlayerId, getSession } from '../polybase/SessionHandler';
import { publishTurnCompleted } from '../ably/AblyMessages';
import { SessionData } from './SessionData';
import useLocalStorageState from 'use-local-storage-state';

import wheelImage from './../assets/spinners/spinner-test.png';
// import pinImage from './../assets/sprites/pin.png';
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
    const [message, setMessage] = useState("Message");
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

    // useEffect(() => {
    //     console.log('AIGame loaded: ', sessionData);

    //     if (!sceneAddedRef.current) { // Check if the scene has been added
    //         GameInstance.getInstance();
    //         console.log('AIGame add scene session', sessionData);
    //         GameInstance.addScene(sessionData ?? "");
    //         sceneAddedRef.current = true;
    //     }

    // }, [sessionData]);

    useEffect(() => {

        const showQuestion = async (event: any) => {
            console.log('showQuestion event: ', event);
            await handleShowQuestion(event?.topic);
        }

        // const hideQuestion = async () => {
        //     setShowQuestionModal(false);
        // }

        addMessageListener(Messages.SHOW_QUESTION, showQuestion);
        addMessageListener(Messages.HIDE_QUESTION, finishTurnAndSaveState);


        return () => {
            removeMessageListener(Messages.SHOW_QUESTION, showQuestion);
            removeMessageListener(Messages.HIDE_QUESTION, finishTurnAndSaveState)
        };

    });

    const spin = async () => {
        if (canSpin) {
            setMessage("Spinning...");
            const minRounds = 2;
            const maxRounds = 4;
            const rounds = Math.floor(Math.random() * (maxRounds - minRounds + 1)) + minRounds;
            const fullCircleDegrees = 360;
            const sliceDegree = fullCircleDegrees / NUM_SLICES;
            const randomOffset = Math.random() * sliceDegree; // random offset within a slice

            const degrees = ((Math.floor(Math.random() * NUM_SLICES) * sliceDegree) + rotationDegrees + randomOffset) % fullCircleDegrees;
            setSelectedSlice(sliceValues[NUM_SLICES - 1 - Math.floor(degrees / sliceDegree)]);
            setCanSpin(false);

            // Calculate total degrees to rotate
            const totalDegrees = rotationDegrees + rounds * fullCircleDegrees + degrees;
            setRotationDegrees(totalDegrees);

            // Wait for spinning animation to complete
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Adjust the duration as needed

            // Call handleSelectedSlice after spinning is complete
            setHasSpun(true);
            setMessage("Finished Spinning");
        }
    }

    function isPlayerTurn(): boolean {
        if (!sessionData?.clientId || !session?.currentTurnPlayerId)
            return false;
        return sessionData.clientId === session.currentTurnPlayerId;
    }

    const setupSessionData = async () => {

        if (!sessionData?.sessionId) return;
        setSession(await pollForCurrentPlayerId(sessionData?.sessionId));

        if (!session) return;

        // Get session data
        const { topics, currentTurnPlayerId } = session;

        // Get topics
        setSliceValues(topics as unknown as string[]);

        // Check if game is active
        if (session.gamePhase !== SessionPhase.GAME_ACTIVE) {
            console.log('Game is not active!');
            // tell page to show that game has not started yet or is over.
            return;
        }
        // // adding the text field
        // this.messageGameText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY / 2 - 100, "", { align: 'center' });
        // // setting text field registration point in its center
        // this.messageGameText.setOrigin(0.5);
        // // aligning the text to center
        // this.messageGameText.setAlign('center');
        if (isPlayerTurn()) {
            setCanSpin(true);
            // this.messageGameText?.setText("Your turn!");
        } else {
            setCanSpin(false);
            // this.messageGameText?.setText(`Waiting for ${currentTurnPlayerId} to finish turn...`);
        }

        // const isHost = await getHostId({ id: sessionData.sessionId }) === sessionData.clientId;
        // if (isHost) this.isHost = true;
        // if (numberPlayers) this.session.numberPlayers = numberPlayers;
    }

    return (
        <div style={{ position: 'relative' }}>
            <Button onClick={() => handleShowQuestion("Music")}>
                Show Question
            </Button>
            <QuestionModal 
                open={showQuestionModal} 
                onClose={finishTurnAndSaveState} 
                question={currentQuestion}
                topic={chosenTopic}
                onExpire={() => finishTurnAndSaveState()}
            />


            <p style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', color: 'black', fontWeight: 'bold' }}>{message}</p>
            <motion.div 
                onClick={spin}
                animate={{ rotate: `${rotationDegrees}deg` }}
                transition={{ duration: 3, ease: "easeOut"}}
                style={{ transformOrigin: "center", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "60px" }}
            >
                <img src={wheelImage} alt="Wheel" style={{ objectFit: "fill" }} />
            </motion.div>

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

function pollUntilSessionChanges(expectedCurrentPlayerId: string, sessionId: string): Promise<any> {

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