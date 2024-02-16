import './AIGame.css';
import { useEffect, useRef, useState } from 'react';
import QuestionModal from '../components/QuestionModal';
import { Question } from '../game-domain/Question';
import { addMessageListener, removeMessageListener } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';
import { SessionData } from './SessionData';
import useLocalStorageState from 'use-local-storage-state';
import { Wheel } from 'react-custom-roulette'
import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';
import { Container, Flex, Portal } from '@mantine/core';
import { SpaceProvider, SpacesProvider } from '@ably/spaces/dist/mjs/react';
import AvatarStack from '../components/avatar_stack/AvatarStack';
import IgnoranceMonkeyCard from '../components/game/IgnorantMonkeyCard';
import CustomButton from '../components/CustomButton';
import Spaces from '@ably/spaces';
import { getSpacesInstance } from '../ably/SpacesSingleton';
import { SessionPhase } from '../game-domain/SessionPhase';
import { useNavigate } from 'react-router-dom';
import { getNextTurnPlayerId, updateSession } from '../mongo/SessionHandler';
import { GameSession } from '../game-domain/GameSession';
import useGameSession from '../mongo/useGameSession';
import { getQuestion } from '../mongo/QuestionHandler';
import { MersenneTwister19937, Random } from 'random-js';
import { Topic } from '../game-domain/Topic';
import GameHeader from '../components/HeaderActions';


function AIGame() {

    const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [chosenTopic, setChosenTopic] = useState<Topic | null>(null);
    const [canSpin, setCanSpin] = useState(false);
    const [message, setMessage] = useState("Loading...");
    const [sliceValues, setSliceValues] = useState<Topic[]>([]);
    const spacesRef = useRef<Spaces | null>(null);
    const useGameSessionHook = useGameSession();
    const navigate = useNavigate();

    useEffect(() => {
        if (!spacesRef.current && sessionData?.clientId) {
            spacesRef.current = getSpacesInstance(sessionData?.clientId);
        }
    }, [sessionData?.clientId]);

    const handleShowQuestion = async (topic: Topic) => {

        if (sessionData?.sessionId) {

            console.log('handle show question button: topic: ', topic);
            const question: Question = await getQuestion({ sessionId: sessionData?.sessionId, topic });

            // // console.log('question', question);
            setCurrentQuestion(question);
            setChosenTopic(topic);
            setShowQuestionModal(true);
        }
    }

    const finishTurnAndSaveState = async () => {
        setShowQuestionModal(false);
        if (!sessionData?.sessionId) return;

        // Update the current player state to the next player
        await getNextTurnPlayerId(sessionData.sessionId);
    }

    useEffect(() => {
        const setupSessionData = async () => {

            if (!useGameSessionHook) return;
            const { topics } = useGameSessionHook;

            console.log('topics: ', topics)

            // Get topics
            setSliceValues(topics as Topic[]);
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
            const { clientId } = sessionData || {};
            const { currentTurnPlayer } = useGameSessionHook || {};

            console.log('isPlayerTurn: ', clientId, currentTurnPlayer);

            const email = currentTurnPlayer?.email;

            return email ? clientId === email : false;
        }

        if (useGameSessionHook) {
            if (isPlayerTurn()) {
                setCanSpin(true);
                setMessage("Your turn!");
            } else {
                setCanSpin(false);

                //message to show
                const _message = `Waiting for ${useGameSessionHook?.currentTurnPlayer?.email ?? ""} to finish turn..`;
                setMessage(_message);

                console.log("message: ", _message);
            }
        }
    }, [sessionData, useGameSessionHook]);

    // Lets detect the winner that reaches the points to win.
    /**
     * gameBoardState: {"mobweb3.technology@gmail.com":1,"norman.lopez.krypto@gmail.com":2}
     */
    useEffect(() => {
        if (useGameSessionHook) {
            const { gamePhase, pointsToWin, playerList, ignoranceMonkey } = useGameSessionHook;
            if (gamePhase === 'GAME_ACTIVE' && pointsToWin && playerList) {

                // Check if ignoranceMonkey has won
                const isIgnoranceMonkeyWinner = ignoranceMonkey && ignoranceMonkey?.points >= pointsToWin;

                const winner = playerList.find((player) => player.points >= pointsToWin) ??
                    (isIgnoranceMonkeyWinner ? ignoranceMonkey : undefined);
                if (winner) {
                    setMessage(`${winner.email} wins!`);
                    setCanSpin(false);
                    // Update game phase to GAME_OVER
                    updateSession(useGameSessionHook?.sessionId, { gamePhase: SessionPhase.GAME_OVER } as GameSession);
                    updateSession(useGameSessionHook?.sessionId, { winner } as GameSession);
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
    const data: WheelData[] = (useGameSessionHook?.topics ?? [])?.map((topic: Topic, index) => {

        // get sequential number from 0 to topicsLength
        let sequentialNumber = index % topicsLength;

        // get random color from array
        const colors = ['#FF591D', '#547DFF', '#05D900', '#F1FF38', '#F67AFF', '#A2EFFF'];
        const sequentialColor = colors[sequentialNumber];

        // lets trim '- Wikipedia' from topic and empty spaces
        let label = topic.name.replace(' - Wikipedia', '').trim();

        // truncate topic to 20 characters
        label = label.length > 10 ? label.substring(0, 10) + "..." : label;

        return {
            option: label,
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
            const random = new Random(MersenneTwister19937.autoSeed());
            const newPrizeNumber = random.integer(0, 5);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    }

    return (
        <Portal>
            <div className='AIGamePage'>
                <GameHeader />
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
                                <AvatarStack showScoreBadge={true} />
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
                        score={useGameSessionHook?.ignoranceMonkey?.points ?? 0} />

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
                                await handleShowQuestion(topicSelected);
                            }} />
                    )}
                    {canSpin && <CustomButton onClick={handleSpinClick}>SPIN</CustomButton>}
                </Flex>
                <QuestionModal
                    open={showQuestionModal}
                    onClose={() => finishTurnAndSaveState()}
                    question={currentQuestion}
                    topic={chosenTopic}
                    onExpire={() => finishTurnAndSaveState()} />
            </div>
        </Portal>

    );
}

export default AIGame;