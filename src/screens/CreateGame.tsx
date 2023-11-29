import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createChannelListenerWrapper } from '../ably/ChannelListener';
import { SignerContext } from '../components/SignerContext';
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

const CreateGame = () => {
    const [nickname, setNickname] = useState('');
    const [numberPlayers, setNumberPlayers] = useState('2');
    const [pointsToWin, setPointsToWin] = useState('10');
    const { web3auth } = useContext(SignerContext);
    const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const { topics } = useContext(TopicContext);
    const [loading, setLoading] = useState(false);
    const [sessionCreated, setSessionCreated] = useState(false);
    const urlRef = useRef('');
    const ref = useRef(null); //qr code ref
    const useGameSessionHook = useGameSession();

    const qrCode = useMemo(() => new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: "",
        image: "https://cryptologos.cc/logos/chimpion-bnana-logo.svg",
        dotsOptions: {
            color: "#4267b2",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#e9ebee",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 20
        }
    }), []);

    useEffect(() => {
        if (!useGameSessionHook) return;

    //  Check if all players have joined
    //  If all players have joined, navigate to SpinWheel
        const { playerList, numberPlayers, gamePhase } = useGameSessionHook;

        if (playerList === undefined || playerList === null ||
             numberPlayers === undefined) return;

        console.log('playerList', playerList);
        const canGoToSpin = playerList.length >= numberPlayers && gamePhase === SessionPhase.TURN_ORDER;
        console.log('canGoToSpin', canGoToSpin);
        if (canGoToSpin) {
            navigate('/spinwheel');
        }
    },[navigate, useGameSessionHook]);

    useEffect(() => {
        const url = `${window.location.origin}/joingame?sessionId=${useGameSessionHook?.id}&channelId=${useGameSessionHook?.channelId}`;
        urlRef.current = url; qrCode.update({
            data: url,
        });
        console.log('qrCode URL to share: ', url);
        if (ref.current) {
            qrCode.append(ref.current);
        }
    }, [sessionCreated, qrCode, useGameSessionHook]);

    const handleCreateChannel = async (data: any) => {
        if (web3auth) {
            const { sessionId, channelId, clientId } = await createChannelListenerWrapper(web3auth, data);
            setSessionData({ sessionId, channelId, clientId });
            return { sessionId, channelId, clientId };
        }
        return {};
    };

    const handleCreateGameButton = async () => {
        setLoading(true);

        if (nickname !== '' && numberPlayers !== '' && pointsToWin !== '') {
            
            // Create AI session question database record in Polybase
            const gameSessionData = await handleCreateChannel({ nickname, numberPlayers, pointsToWin, topics });
            
            if (gameSessionData) {
                // Create question session
                const response = await createQuestionSession({
                    sessionId: gameSessionData.sessionId,
                    clientId: sessionData?.clientId
                });

                if (response) {
                    const questionSessionId = response.recordData.data.id;
                    // Deploy generation of AI questions
                    await generateAllQuestions(topics, questionSessionId, true);
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
                }

            }
            // console.log('handlePlayButtonClick setSessionCreated');
            setSessionCreated(true);
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