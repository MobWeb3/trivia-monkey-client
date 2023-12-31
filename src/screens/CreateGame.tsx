import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createChannelListenerWrapper } from '../ably/ChannelListener';
import { useNavigate } from 'react-router-dom';
import { Flex, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import QRCodeStyling from "qr-code-styling";
import { createQuestionSession } from '../polybase/QuestionsHandler';
import { generateAllQuestions } from '../game-domain/GenerateQuestionsHandler';
import { addPlayer, updateQuestionSessionId, updateSessionPhase, updateTopics } from '../polybase/SessionHandler';
import { SessionData } from './SessionData';
import useLocalStorageState from 'use-local-storage-state';
import CreateGameForm from '../components/CreateGameFields';
import './CreateGame.css'
import DisplayTitle from '../components/DisplayTitle';
import ShareModal from '../components/share/ShareModal';
import CustomButton from '../components/CustomButton';
import { Topic, TopicContext } from '../components/topics/TopicContext';
import useGameSession from '../polybase/useGameSession';
import { SessionPhase } from '../game-domain/SessionPhase';
import imageSource from '../assets/monkeys_avatars/astronaut-monkey1-200x200.png';

const CreateGame = () => {
    const [nickname, setNickname] = useState('');
    const [numberPlayers, setNumberPlayers] = useState('2');
    const [pointsToWin, setPointsToWin] = useState('10');
    const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const { topics } = useContext(TopicContext);
    const [loading, setLoading] = useState(false);
    const [sessionCreated, setSessionCreated] = useState(false);
    const urlRef = useRef('');
    const ref = useRef(null); //qr code ref
    const useGameSessionHook = useGameSession();
    const [createGamePressed, setCreateGamePressed] = useState(false);

    const qrCode = useMemo(() => new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: "",
        image: imageSource,
        dotsOptions: {
            color: "#4267b2",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#e9ebee",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 10  
        }
    }), []);

    useEffect(() => {

        // This useEffect will run only if create sesion has been clicked
        if (!createGamePressed) {
            // lets clear the sessionData.sessionId. Let's have a clean start
            setSessionData({ ...sessionData, sessionId: undefined, channelId: undefined });
            return;
        } 

        if (!useGameSessionHook) return;

    //  Check if all players have joined
    //  If all players have joined, navigate to SpinWheel
        const { playerList, numberPlayers, gamePhase } = useGameSessionHook;

        if (playerList === undefined || playerList === null ||
             numberPlayers === undefined) return;

        // console.log('playerList', playerList);
        const canGoToSpin = playerList.length >= numberPlayers && gamePhase === SessionPhase.TURN_ORDER;
        // console.log('canGoToSpin', canGoToSpin);
        if (canGoToSpin) {
            navigate('/spinwheel');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[createGamePressed, useGameSessionHook?.playerList, useGameSessionHook?.numberPlayers, useGameSessionHook?.gamePhase]);



    useEffect(() => {
        if (!createGamePressed) return;

        const url = `${window.location.origin}/joingame?sessionId=${useGameSessionHook?.id}&channelId=${useGameSessionHook?.channelId}`;
        urlRef.current = url;
        qrCode.update({
            data: url,
        });
        console.log('qrCode URL to share: ', url);
        if (ref.current) {
            qrCode.append(ref.current);
        }
    }, [createGamePressed, qrCode, sessionCreated, useGameSessionHook?.id, useGameSessionHook?.channelId]);

    const createChannel = async (data: any) => {
        const { sessionId, channelId } = await createChannelListenerWrapper(data);
        setSessionData({ ...sessionId, sessionId, channelId });
        return { sessionId, channelId };
    };

    const handleCreateGameButton = async () => {
        setLoading(true);
        setCreateGamePressed(true);
        console.log("session data: ", sessionData)
        if (nickname !== '' && numberPlayers !== '' && pointsToWin !== '' && sessionData?.clientId) {
            
            // Create AI session question database record in Polybase
            const gameSessionData = await createChannel(
                { nickname, numberPlayers, pointsToWin, topics,
                    clientId: sessionData?.clientId
                 });
            
            if (gameSessionData?.sessionId && gameSessionData?.channelId) {
                // Create question session
                const response = await createQuestionSession({
                    sessionId: gameSessionData.sessionId,
                    clientId: sessionData?.clientId
                });

                const questionSessionId = response?.recordData?.data?.id;

                if (questionSessionId) {
                    
                    // Deploy generation of AI questions
                    generateAllQuestions(topics, questionSessionId, true);
                    // Update topics to Game session
                    await updateTopics({ id: gameSessionData?.sessionId, topics: topics.map((topic: Topic) => topic[0]) });
                    // console.log('updatedTopics response:', addTopicResponse);

                    // Set questionSessionId in the Game session records
                    await updateQuestionSessionId({ id: gameSessionData?.sessionId, questionSessionId });

                    // add player to game session
                    await addPlayer({ id: gameSessionData?.sessionId, playerId: sessionData?.clientId });

                    // Change game state to TURN_ORDER
                    await updateSessionPhase({id: gameSessionData?.sessionId, newPhase: SessionPhase.TURN_ORDER});

                    // save to sessionData
                    setSessionData({
                        ...sessionData,
                        sessionId: gameSessionData?.sessionId,
                        channelId: gameSessionData?.channelId,
                        clientId: sessionData?.clientId,
                        questionSessionId
                    });

                    setSessionCreated(true);
                }
                else {
                    console.error('Error creating question session A');
                    setLoading(false);
                }
            }
            else {
                console.error('Error creating question session');
                console.log(`Error creating question session. Missing any of the following data
                channelId or sessionId `);
            }
            // console.log('handlePlayButtonClick setSessionCreated');
        }
        else {
            console.error(`Error creating question session. Missing any of the following data
            nickname,poinstToWin, numberPlayers,clientId `);        
        }
        setLoading(false);
    };

    const WaitingMessage = () => {
        const [isShareModalOpen, setShareModalOpen] = useState(false);

        const openShareModal = () => setShareModalOpen(true);
        const closeShareModal = () => setShareModalOpen(false);

        return (
            <Flex
                mih={50}
                bg="rgba(0, 0, 0, .3)"
                gap="md"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
            >
                <DisplayTitle text={'Waiting for others to join'} fontSize='25px' background='#FDD673' />
                <div ref={ref} onClick={openShareModal} />
                {/* add a label to press the QR code to share link*/}
                <CustomButton fontSize='15px' background='#6562DF' color='#FDD673' onClick={openShareModal}> share link </CustomButton>
                <ShareModal url={urlRef.current} isOpen={isShareModalOpen} onClose={closeShareModal} />
            </Flex>

        );
    };

    return (
        <div className='createGamePage'>
            {
                loading ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                        <p>Creating game session... </p>
                        <div>
                            <Loader variant="bars" />
                        </div>
                    </div> :
                    sessionCreated ? <WaitingMessage /> : (
                        <div className='createGameForm'>
                            <CreateGameForm
                                setNickname={setNickname}
                                setNumberPlayers={setNumberPlayers}
                                setPointsToWin={setPointsToWin}
                                openModal={open}
                                opened={opened}
                                numberPlayers={numberPlayers}
                                closeModal={close}
                                handlePlayButtonClick={handleCreateGameButton}
                            />
                        </div>
                    )
            }
        </div>
    );
};

export default CreateGame;