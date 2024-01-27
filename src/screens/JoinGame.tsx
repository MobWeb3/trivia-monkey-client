import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { Container, Flex, Modal } from '@mantine/core';
import { PickTopicComponent } from '../components/topics/PickTopicComponent';
import { useDisclosure } from '@mantine/hooks';
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
import { UserInfo } from '@web3auth/base';
import { AuthSessionData } from '../game-domain/AuthSessionData';
import { addPlayer, getSession, addTopics } from '../mongo/SessionHandler';
import useGameSession from '../mongo/useGameSession';
import { createUser, userExists } from '../mongo/PlayerHandler';

const JoinGame = () => {
    const navigate = useNavigate();
    const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const [authSessionData, setAuthSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});
    const location = useLocation();
    const [opened, { open, close }] = useDisclosure(false);
    const [numberPlayers, setNumberPlayers] = useState<number>(0);
    const [joined, setJoined] = useState(false);
    const { topics } = useContext(TopicContext);
    const useGameSessionHook = useGameSession();
    const userInfoRef = useRef<Partial<UserInfo> | null>(null);

    useEffect(() => {

        // If all players have joined, navigate to SpinWheel and joined the game
        // automatically navigate to SpinWheel
        if (sessionData?.sessionId && sessionData?.channelId && useGameSessionHook) {
            const { playerList, numberPlayers, gamePhase } = useGameSessionHook;

            if (playerList === undefined || numberPlayers === undefined || gamePhase === undefined) return;

            const canGoToSpin = playerList.length >= numberPlayers && gamePhase === SessionPhase.TURN_ORDER;
            // console.log('canGoToSpin', canGoToSpin);
            if (canGoToSpin) {
                navigate('/spinwheel');
            }
        }

    }, [navigate, sessionData?.channelId, sessionData?.sessionId, topics, useGameSessionHook]);


    useEffect(() => {
        const parsed = queryString.parse(location.search);
        const channelId = parsed.channelId as string;
        const sessionId = parsed.sessionId as string;

        if (sessionId && channelId) {
            getSession(sessionId).then((gameSession) => {
                setNumberPlayers(gameSession.numberPlayers);
                setSessionData({
                    ...sessionData,
                    sessionId: sessionId,
                    channelId: channelId,
                    questionSessionId: gameSession.questionSessionId
                });
            });
            // console.log('JoinGame sessionData state ', sessionData);
            // handleJoinGame({ channelId });
        }
    });

    const handleJoinButtonClick = async () => {
        await retryLogin();
        await joinIfAlreadyActiveGame();
        if (sessionData?.channelId !== '' && sessionData?.sessionId) {

            // Generate questions
            generateAllQuestions(topics, true);

            // Update topics to Game session
            await addTopics({ sessionId: sessionData?.sessionId, topics: topics.map((topic) => topic.name) })

            // console.log('JoinGame handleJoinGame: ', sessionData);

            // add player to game session
            await addPlayer({ sessionId: sessionData?.sessionId, playerId: userInfoRef.current?.email as string })

            setJoined(true);

        }
    };

    const joinIfAlreadyActiveGame = async () => {
        if (sessionData?.sessionId && sessionData?.channelId) {
            try {
                const { questionSessionId, gamePhase } = await getSession(sessionData?.sessionId);

                if (gamePhase === SessionPhase.GAME_ACTIVE) {
                    setSessionData({
                        ...sessionData,
                        questionSessionId: questionSessionId
                    });

                    // initialize web3auth
                    const userInfo = await login();
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    if (sessionData) {
                        setSessionData({ ...sessionData, clientId: userInfo.email });
                    }
                    navigate('/aigame');
                }
            } catch (error) {
                console.log("joinIfAlreadyActiveGame - Error getting session: ", error);
            }

        }

    }

    const retryLogin = async () => {
        // initialize web3auth
        const userInfo = await login();
        await mCreatePlayerIfNotExists(userInfo);
        setSessionData({ ...sessionData, clientId: userInfo?.email});
        setAuthSessionData({ ...authSessionData, userInfo});
        if (sessionData && userInfo) {
            setSessionData({ ...sessionData, clientId: userInfo.email });
            userInfoRef.current = userInfo;
        }
    }

    const mCreatePlayerIfNotExists = async (userInfo: Partial<UserInfo>) => {
        console.log('userInfo: ', userInfo);
        const userExist = await userExists(userInfo?.email ?? "");
        if (!userExist) {
          console.log('user does not exist, creating user');
          // create user
          const createdPlayer = await createUser({
            email: userInfo.email ?? "",
            name: userInfo.name ?? ""
          });
          console.log('createdPlayer: ', createdPlayer);
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
                        <Modal
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
                                numberOfPlayers={numberPlayers}
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