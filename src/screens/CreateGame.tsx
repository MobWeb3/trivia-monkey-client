import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createChannelListenerWrapper } from '../ably/ChannelListener';
import { SignerContext } from '../components/SignerContext';
import { Messages } from '../utils/Messages';
import { useNavigate } from 'react-router-dom';
import { Flex, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import QRCodeStyling from "qr-code-styling";
import { addQuestions, createQuestionSession } from '../polybase/QuestionsHandler';
import { generateAllQuestions } from '../game-domain/GenerateQuestionsHandler';
import { updateQuestionSessionId, updateTopics } from '../polybase/SessionHandler';
import { SessionData } from './SessionData';
import useLocalStorageState from 'use-local-storage-state';
import CreateGameForm from '../components/CreateGameFields';
import './CreateGame.css'
import DisplayTitle from '../components/DisplayTitle';
import ShareModal from '../components/share/ShareModal';
import CustomButton from '../components/CustomButton';
import { TopicContext } from '../components/topics/TopicContext';

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
        // console.log("topics: ", topics)
        // console.log('sessionData: ', sessionData);
        const handleAllPlayersJoined = (event: any) => {
            console.log('All players have joined', event.detail);
            setSessionData({ ...sessionData, ...event.detail });
            // Handle the event here
            navigate('/spinwheel');
        };

        window.addEventListener(Messages.ALL_PLAYERS_JOINED, handleAllPlayersJoined);

        // Cleanup listener when component unmounts
        return () => {
            window.removeEventListener(Messages.ALL_PLAYERS_JOINED, handleAllPlayersJoined);
        };
    });

    useEffect(() => {
        const url = `${window.location.origin}/joingame?sessionId=${sessionData?.sessionId}&channelId=${sessionData?.channelId}`;
        urlRef.current =url;        qrCode.update({
          data: url,
        });
        console.log('qrCode URL to share: ', url);
        if (ref.current) {
            qrCode.append(ref.current);
        }
    }, [sessionCreated, qrCode, sessionData?.channelId, sessionData?.sessionId]);

    const handleCreateChannel = async (data: any) => {
        if (web3auth) {
            const { sessionId, channelId, clientId } = await createChannelListenerWrapper(web3auth, data);
            // console.log('handleCreateChannel: ', sessionId, channelId);
            setSessionData({ sessionId, channelId, clientId });
            return { sessionId, channelId, clientId };
        }
        return {};
    };

    const handleCreateGameButton = async () => {
        setLoading(true);

        // console.log('handlePlayButtonClick A');
        if (nickname !== '' && numberPlayers !== '' && pointsToWin !== '') {
            // console.log('handlePlayButtonClick B');
            const sessionData = await handleCreateChannel({ nickname, numberPlayers, pointsToWin, topics });
            // console.log('handlePlayButtonClick sessionData', sessionData);
            // Create AI session question database record in Polybase
            if (sessionData) {
                // console.log('entered createQuestionSession', sessionData);
                const response = await createQuestionSession({
                    sessionId: sessionData.sessionId,
                    clientId: sessionData.clientId
                });

                // console.log('createQuestionSession response: ', response);
                // console.log('topics', topics)
                if (response) {
                    const questionSessionId = response.recordData.data.id;
                    // Deploy generation of AI questions
                    generateAllQuestions(topics, true)
                        .then((result) => {
                            console.log('generateQuestions response: ', result);
                            addQuestions({ id: questionSessionId, column: 1, topics: result });
                        });
                    // Update topics to Game session
                    await updateTopics({ id: sessionData?.sessionId, topics: topics.map((topic) => topic[0]) });
                    // console.log('updatedTopics response:', addTopicResponse);

                    // Set questionSessionId in the Game session records
                    updateQuestionSessionId({ id: sessionData?.sessionId, questionSessionId });
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
                <DisplayTitle text={'Waiting for others to join'} fontSize='25px' background='#FDD673'/>
                <div ref={ref} onClick={openShareModal}/>
                {/* add a label to press the QR code to share link*/}
                <CustomButton fontSize='15px' background='#6562DF' color='#FDD673' onClick={openShareModal}> share link </CustomButton>
                <ShareModal url={urlRef.current} isOpen={isShareModalOpen} onClose={closeShareModal}/>
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