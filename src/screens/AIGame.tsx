import './AIGame.css';
import { useEffect, useRef, useState } from 'react';
import QuestionModal from '../components/QuestionModal';
import { getQuestion } from '../polybase/QuestionsHandler';
import { Question } from '../game-domain/Question';
import { addMessageListener, removeMessageListener } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';
import { getNextTurnPlayerId, getSession } from '../polybase/SessionHandler';
import { publishTurnCompleted, subscribeToTurnCompleted, unsubscribeToTurnCompleted } from '../ably/AblyMessages';
import { SessionData } from './SessionData';
import useLocalStorageState from 'use-local-storage-state';
import { GameSession } from '../game-domain/GameSession';
import { Wheel } from 'react-custom-roulette'
import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';
import { pollForCurrentPlayerId, pollUntilSessionChanges } from '../polybase/PollHelpers';
import { Container, Flex } from '@mantine/core';
import { SpaceProvider, SpacesProvider } from '@ably/spaces/dist/mjs/react';
import AvatarStack from '../components/avatar_stack/AvatarStack';
import Spaces from '@ably/spaces';
import { Realtime } from 'ably';
import IgnoranceMonkeyCard from '../components/game/IgnorantMonkeyCard';
import CustomButton from '../components/CustomButton';

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
    const spacesRef = useRef<Spaces | null>(null);

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
        setShowQuestionModal(true);
    }

    const finishTurnAndSaveState = async () => {
        setShowQuestionModal(false);
        // Update turn on polybase
        const { nextTurnPlayerId } = await getNextTurnPlayerId({ id: sessionData?.sessionId });
        // Publish turn completed // we know clientId is not null because we checked isPlayerTurn
        if (sessionData?.clientId && sessionData.channelId) {
            console.log("publish completed turn");
            await publishTurnCompleted(sessionData?.clientId, sessionData.channelId, { nextTurnPlayerId });
        }
    }

    useEffect(() => {
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
        }

        setupSessionData();
    }, [sessionData?.sessionId]);

    useEffect(() => {

        if (!sessionData?.clientId || !sessionData?.channelId) return;

        async function updateTurn(expectedCurrentPlayerId: string) {
            try {
                const session: GameSession = await pollUntilSessionChanges(expectedCurrentPlayerId, sessionData?.sessionId ?? '');
                if (!session) return;
                setSession(session);
                const { topics } = session;
                setSliceValues(topics as unknown as string[]);

            } catch (error) {
                console.log("error updating session data: ", error);
            }
        }
        if (sessionData?.clientId && sessionData?.channelId) {
            console.log("subscribed to turn completed");
            subscribeToTurnCompleted(sessionData?.clientId, sessionData?.channelId);
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
            if (!sessionData?.clientId || !sessionData?.channelId) return;
            unsubscribeToTurnCompleted(sessionData?.clientId, sessionData?.channelId)
        };
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        addMessageListener(Messages.HIDE_QUESTION, finishTurnAndSaveState);
        return () => {
            // removeMessageListener(Messages.SHOW_QUESTION, showQuestion);
            removeMessageListener(Messages.HIDE_QUESTION, finishTurnAndSaveState)
        };
    });

    useEffect(() => {
        function isPlayerTurn(): boolean {
            console.log('isPlayerTurn: ', sessionData?.clientId, session?.currentTurnPlayerId);
            if (!sessionData?.clientId || !session?.currentTurnPlayerId)
                return false;
            return sessionData.clientId === session.currentTurnPlayerId;
        }

        if (session) {
            if (isPlayerTurn()) {
                setCanSpin(true);
                setMessage("Your turn!");
            } else {
                setCanSpin(false);

                //message to show
                const _message = `Waiting for ${session?.currentTurnPlayerId ?? ""} to finish turn..`;
                setMessage(_message);

                console.log("message: ", _message);                
            }
        }
    }, [session, sessionData?.clientId]);


    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const topicsLength = 6;
    const data: WheelData[] = (session?.topics ?? [])?.map((topic: string, index) => {

        // get sequential number from 0 to topicsLength
        let sequentialNumber = index % topicsLength;

        // get random color from array
        const colors = ['#FF591D', '#547DFF', '#05D900', '#F1FF38', '#F67AFF', '#A2EFFF'];
        const sequentialColor = colors[sequentialNumber];

        // lets trim '- Wikipedia' from topic and empty spaces
        topic = topic.replace('- Wikipedia', '').trim();

        // truncate topic to 20 characters
        topic = topic.length > 10 ? topic.substring(0, 10) + "..." : topic;

        return {
            option: topic,
            style: {
                backgroundColor: sequentialColor,
                textColor: 'black',
                fontFamily: 'umbrage2',
            }
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

    function getSpaces() {
        if (spacesRef.current !== null) {
            const spaces: Spaces = spacesRef.current;
            return spaces;
        }
        return new Spaces(new Realtime.Promise({
            key: import.meta.env.VITE_APP_ABLY_API_KEY ?? "",
            clientId: sessionData?.clientId
        }))
    }

    return (
        <div className='AIGamePage'>
            <Flex
                className="flex-container"
                direction='column'
                align='center'
                justify='center'
                gap="md"
            >
                <div className='topAvatarStacks'>
                    <SpacesProvider client={getSpaces()}>
                        <SpaceProvider name="avatar-stack">
                            <AvatarStack />
                        </SpaceProvider>
                    </SpacesProvider>
                </div>

                <Container bg="linear-gradient(to bottom right, #FDD673, #D5B45B)"
                    className='messageBox'
                >
                    {message}
                </Container>

                <IgnoranceMonkeyCard message={'heyooo.... fdssfd fd fsdfdsf sfsdf sdfdsfdsfds\nsdfdsf'} />

                {data && data.length > 0 && (

                    <Wheel
                        mustStartSpinning={mustSpin}
                        prizeNumber={prizeNumber}
                        fontSize={25}
                        data={data}
                        radiusLineColor={'#fff'}
                        radiusLineWidth={1}
                        onStopSpinning={async () => {
                            setMustSpin(false);
                            const topicSelected = sliceValues[prizeNumber];
                            setSelectedSlice(topicSelected)
                            await handleShowQuestion(topicSelected)
                        }}
                    />
                )}
                {canSpin && <CustomButton onClick={handleSpinClick}>SPIN</CustomButton>}
            </Flex>
            <QuestionModal
                open={showQuestionModal}
                onClose={() => finishTurnAndSaveState()}
                question={currentQuestion}
                topic={chosenTopic}
                onExpire={() => finishTurnAndSaveState()}
            />
        </div>

    );
}

export default AIGame;