import { useContext, useEffect, useState } from 'react';
import { SignerContext } from '../components/SignerContext';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { Container, Flex, Modal } from '@mantine/core';
import { PickTopicComponent } from '../components/topics/PickTopicComponent';
import { useDisclosure } from '@mantine/hooks';
import { addPlayer, getSession, updateTopics } from '../polybase/SessionHandler';
import { generateAllQuestions } from '../game-domain/GenerateQuestionsHandler';
import { SessionPhase } from '../game-domain/SessionPhase';
import { login } from '../utils/Web3AuthAuthentication';
import { SessionData } from './SessionData';
import useLocalStorageState from 'use-local-storage-state';
import WaitingScreen from '../components/WaitingScreen';
import './JoinGame.css';
import CustomButton from '../components/CustomButton';
import SelectedTopicEntries from '../components/topics/SelectedTopicEntries';
import { TopicContext } from '../components/topics/TopicContext';
import useGameSession from '../polybase/useGameSession';

const JoinGame = () => {
    // const [channelId, setChannelId] = useState('');
    const { web3auth } = useContext(SignerContext);
    const navigate = useNavigate();
    const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const location = useLocation();
    const [opened, { open, close }] = useDisclosure(false);
    // const [selectedChips] = useState<string[]>([]);
    const [numberPlayers, setNumberPlayers] = useState<string>('');
    const [joined, setJoined] = useState(false);
    const { topics } = useContext(TopicContext);
    const useGameSessionHook = useGameSession();

    useEffect(() => {

        // If all players have joined, navigate to SpinWheel and joined the game
        // automatically navigate to SpinWheel
        if (sessionData?.sessionId && sessionData?.channelId) {
            const { playerList, numberPlayers, gamePhase } = useGameSessionHook;

            if (playerList === undefined || numberPlayers === undefined || gamePhase === undefined) return;

            const canGoToSpin = playerList.length >= numberPlayers && gamePhase === SessionPhase.TURN_ORDER;
            console.log('canGoToSpin', canGoToSpin);
            if (canGoToSpin) {
                navigate('/spinwheel');
            }
        }

    }, [navigate, sessionData?.channelId, sessionData?.sessionId, topics, useGameSessionHook]);


    useEffect(() => {
        const parsed = queryString.parse(location.search);
        const { sessionId, channelId } = parsed;

        console.log('JoinGame loaded: ', sessionId, channelId);
        console.log("topics: ", topics)
        if (sessionId && channelId) {
            getSession({ id: sessionId }).then((_sessionData) => {
                setNumberPlayers(_sessionData.numberPlayers);
                setSessionData({
                    ...sessionData,
                    sessionId: sessionId as string,
                    channelId: channelId as string,
                    questionSessionId: _sessionData.questionSessionId
                });
            });
            // setChannelId(channelId as string);

            console.log('JoinGame sessionData state ', sessionData);
            // handleJoinGame({ channelId });
        }
    });

    const handleJoinGame = async (data: any) => {
        if (web3auth) {
            // await enterChannelListenerWrapper(web3auth, data);

            // Generate questions
            generateAllQuestions(topics, sessionData?.questionSessionId as string, true);
            
            // Update topics to Game session
            await updateTopics({ id: sessionData?.sessionId, topics: topics.map((topic) => topic[0]) })

            // add player to game session
            await addPlayer({ id: sessionData?.sessionId,playerId: sessionData?.clientId })

            setJoined(true);
        }
    };

    const handleJoinButtonClick = () => {
        if (!web3auth) retryLogin();
        joinIfAlreadyActiveGame();
        if (sessionData?.channelId !== '') {
            handleJoinGame({ channelId: sessionData?.channelId });
        }
    };

    const joinIfAlreadyActiveGame = async () => {
        if (sessionData?.sessionId && sessionData?.channelId) {
            try {
                const { questionSessionId, gamePhase } = await getSession({ id: sessionData?.sessionId });

                if (gamePhase === SessionPhase.GAME_ACTIVE) {
                    setSessionData({
                        ...sessionData,
                        questionSessionId: questionSessionId
                    });

                    // initialize web3auth
                    if (web3auth) {
                        const userInfo = await login(web3auth);
                        localStorage.setItem('userInfo', JSON.stringify(userInfo));
                        if (sessionData) {
                            setSessionData({ ...sessionData, clientId: userInfo.email });
                        }
                    }

                    navigate('/aigame');
                }
                else if (gamePhase === SessionPhase.TURN_ORDER) {
                    await retryLogin();
                    navigate('/spinwheel');
                }
            } catch (error) {
                console.log("joinIfAlreadyActiveGame - Error getting session: ", error);
            }

        }

    }

    const retryLogin = async () => {
        // initialize web3auth
        if (web3auth) {
            const userInfo = await login(web3auth);
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            if (sessionData) {
                setSessionData({ ...sessionData, clientId: userInfo.email });
            }
        }
    }

    return (
        <div className='JoinGamePage'>
            {
                joined && <WaitingScreen />
            }
            {
                !joined && <div className='joinGameForm'>
                    <Flex
                        gap="sm"
                        justify="center"
                        align="center"
                        direction="column"
                        w="100%"
                    >
                        <Container fluid bg="#FDD673" w="100%" className='container-number-players'>
                            Select topics and Join
                        </Container>

                        <CustomButton
                            fontSize={"32px"}
                            onClick={open}
                            background='linear-gradient(to bottom right, orange, red)'
                            color='#2B2C21'
                            style={{
                                marginTop: '5px',
                                marginBottom: '5px',
                            }}>Select topics
                        </CustomButton>

                        <SelectedTopicEntries
                            entrySize={topics.length}
                        />

                        {/* show Join if all three topics filled */}
                        {topics.length >= 3 && <CustomButton
                            onClick={handleJoinButtonClick}
                            style={{
                                marginTop: '5px',
                                marginBottom: '5px',
                            }}
                        >Join
                        </CustomButton>}

                    </Flex>
                    <div className='ModalContent'>
                        {/* # For some reason I need to position to the left around -%13 to center the modal. */}
                        <Modal
                            pos={"absolute"}
                            left={'-5%'}
                            right={'-5%'}
                            yOffset={'5dvh'}
                            opened={opened}
                            onClose={close}
                            radius={'xl'}
                            withCloseButton={false}
                            styles={{
                                body: { backgroundColor: '#1AB2C7' },
                            }}
                        >
                            <PickTopicComponent
                                numberOfPlayers={parseInt(numberPlayers)}
                                closeModal={close}
                                style={
                                    {
                                        backgroundColor: '#1AB2C7',
                                    }
                                }
                            />
                        </Modal>
                    </div>

                </div>
            }


        </div>

    );
};

export default JoinGame;


/**
 * ${BASE_URL}/joingame?sessionId=mk-pbid-de8a7ec4-79c3-44c8-95bf-8a037ade0dc2&channelId=tm-chid-e20516c1-b458-47ea-8c08-e0a2f1dd4dfa
 */