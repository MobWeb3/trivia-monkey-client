import './AIGame.css';
import { useEffect, useRef, useState } from 'react';
import QuestionModal from '../components/QuestionModal';
import { getQuestion } from '../polybase/QuestionsHandler';
import { Question } from '../game-domain/Question';
import { addMessageListener, removeMessageListener } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';
import { getNextTurnPlayerId, getSession, setWinner, updateSessionPhase } from '../polybase/SessionHandler';
import { SessionData } from './SessionData';
import useLocalStorageState from 'use-local-storage-state';
import { Wheel } from 'react-custom-roulette'
import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';
import { Container, Flex } from '@mantine/core';
import { SpaceProvider, SpacesProvider } from '@ably/spaces/dist/mjs/react';
import AvatarStack from '../components/avatar_stack/AvatarStack';
import IgnoranceMonkeyCard from '../components/game/IgnorantMonkeyCard';
import CustomButton from '../components/CustomButton';
import Spaces from '@ably/spaces';
import { getSpacesInstance } from '../ably/SpacesSingleton';
import useGameSession from '../polybase/useGameSession';
import { SessionPhase } from '../game-domain/SessionPhase';
import { useNavigate } from 'react-router-dom';
import { IGNORANCE_MONKEY_NAME } from '../game-domain/Session';


function AIGame() {

    const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [chosenTopic, setChosenTopic] = useState<string | null>(null);
    const [canSpin, setCanSpin] = useState(false);
    const [message, setMessage] = useState("Loading...");
    const [sliceValues, setSliceValues] = useState<string[]>([]);
    const spacesRef = useRef<Spaces | null>(null);
    const useGameSessionHook = useGameSession();
    const navigate = useNavigate();

    useEffect(() => {
        if (!spacesRef.current && sessionData?.clientId){
            spacesRef.current = getSpacesInstance(sessionData?.clientId);
        }
    }, [sessionData?.clientId]);

    const handleShowQuestion = async (topic: string) => {

        if (!sessionData?.questionSessionId) {
            const { questionSessionId } = await getSession({ id: sessionData?.sessionId })
            setSessionData({ ...sessionData, questionSessionId });
        }

        // console.log(`topic ${topic}, questionSessionId ${sessionData?.questionSessionId}`);
        const question: Question = await getQuestion({ id: sessionData?.questionSessionId, topic });

        // console.log('question', question);
        setCurrentQuestion(question);
        setChosenTopic(topic);
        setShowQuestionModal(true);
    }

    const finishTurnAndSaveState = async () => {
        setShowQuestionModal(false);
        // Update turn on polybase
        await getNextTurnPlayerId({ id: sessionData?.sessionId });
    }

    useEffect(() => {
        const setupSessionData = async () => {

            if (!useGameSessionHook) return;
            const { topics } = useGameSessionHook;

            console.log('topics: ', topics)

            // Get topics
            setSliceValues(topics as unknown as string[]);
        }

        setupSessionData();
    }, [useGameSessionHook]);

    useEffect(() => {
        addMessageListener(Messages.HIDE_QUESTION, finishTurnAndSaveState);
        return () => {
            removeMessageListener(Messages.HIDE_QUESTION, finishTurnAndSaveState)
        };
    });

    useEffect(() => {
        function isPlayerTurn(): boolean {
            console.log('isPlayerTurn: ', sessionData?.clientId, useGameSessionHook?.currentTurnPlayerId);
            if (!sessionData?.clientId || !useGameSessionHook?.currentTurnPlayerId)
                return false;
            return sessionData.clientId === useGameSessionHook.currentTurnPlayerId;
        }

        if (useGameSessionHook) {
            if (isPlayerTurn()) {
                setCanSpin(true);
                setMessage("Your turn!");
            } else {
                setCanSpin(false);

                //message to show
                const _message = `Waiting for ${useGameSessionHook?.currentTurnPlayerId ?? ""} to finish turn..`;
                setMessage(_message);

                console.log("message: ", _message);                
            }
        }
    }, [sessionData?.clientId, useGameSessionHook]);

    // Lets detect the winner that reaches the points to win.
    /**
     * gameBoardState: {"mobweb3.technology@gmail.com":1,"norman.lopez.krypto@gmail.com":2}
     */
    useEffect(() => {
        if (useGameSessionHook) {
            const { gamePhase, pointsToWinTheGame, gameBoardState } = useGameSessionHook;
            if (gamePhase === 'GAME_ACTIVE' && pointsToWinTheGame && gameBoardState) {


                const winner = Object.keys(gameBoardState).find((key) => gameBoardState[key] >= pointsToWinTheGame);
                if (winner) {
                    setMessage(`${winner} wins!`);
                    setCanSpin(false);
                    // Update game phase to GAME_OVER
                    updateSessionPhase({ id: useGameSessionHook?.id, newPhase: SessionPhase.GAME_OVER });

                    // update winner on polybase
                    setWinner({ id: useGameSessionHook?.id, winner });
                }
            }
            else if (gamePhase === 'GAME_OVER') {
                setMessage(`Game over!`);
                setCanSpin(false);

                // navigate to Scores screen - winner announced

                navigate('/scoretree')

            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [useGameSessionHook]);


    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const topicsLength = 6;
    const data: WheelData[] = (useGameSessionHook?.topics ?? [])?.map((topic: string, index) => {

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

    return (
        <div className='AIGamePage'>
            <Flex
                className="flex-container"
                direction='column'
                align='center'
                justify='center'
                gap="md"
            >
                {spacesRef.current && (
                <SpacesProvider client={spacesRef.current}>
                    <SpaceProvider name="avatar-stack">
                    <AvatarStack showScoreBadge={true}/>
                    </SpaceProvider>
                </SpacesProvider>
                )}

                <Container bg="linear-gradient(to bottom right, #FDD673, #D5B45B)"
                    className='messageBox'
                >
                    {message}
                </Container>

                <IgnoranceMonkeyCard 
                    message={'heyooo.... fdssfd fd fsdfdsf sfsdf sdfdsfdsfds\nsdfdsf'}
                    score={useGameSessionHook?.gameBoardState?.[IGNORANCE_MONKEY_NAME] ?? 0}
                />

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