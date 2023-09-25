import { useContext, useEffect, useState } from 'react';
import { enterChannelListenerWrapper } from '../ably/ChannelListener';
import { SignerContext } from '../components/SignerContext';
import { Messages } from '../utils/Messages';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { Badge, Button, Group, Modal } from '@mantine/core';
import ModalContent from '../components/ModalContent';
import { useDisclosure } from '@mantine/hooks';
import { getSession, updateTopics } from '../polybase/SessionHandler';
import { generateQuestions } from '../game-domain/GenerateQuestionsHandler';
import { addQuestions } from '../polybase/QuestionsHandler';
import { SessionPhase } from '../game-domain/SessionPhase';
import { login } from '../utils/Web3AuthAuthentication';
import createPersistedState from 'use-persisted-state';
import { SessionData } from './SessionData';

const useSessionDataState = createPersistedState<SessionData | null>('sessionData');

const JoinGame = () => {
    const [channelId, setChannelId] = useState('');
    const { web3auth } = useContext(SignerContext);
    const navigate = useNavigate();
    const [sessionData, setSessionData] = useSessionDataState(null);
    const location = useLocation();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedChips, setSelectedChips] = useState<string[]>([]);
    const [numberPlayers, setNumberPlayers] = useState<number>(0);
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        const handleAllPlayersJoined = (event: any) => {
            console.log('All players have joined', event.detail);
            setSessionData(event.detail);
            // Handle the event here
            
            // If all players have joined and current player joined, navigate to SpinWheel
            navigate('/spinwheel');    
        };

        window.addEventListener(Messages.ALL_PLAYERS_JOINED, handleAllPlayersJoined);

        // Cleanup listener when component unmounts
        return () => {
            window.removeEventListener(Messages.ALL_PLAYERS_JOINED, handleAllPlayersJoined);
        };
    }, []);

    useEffect(() => {
        const parsed = queryString.parse(location.search);
        const { sessionId, channelId } = parsed;

        console.log('JoinGame loaded: ', sessionId, channelId);
        if (sessionId && channelId) {
            getSession({ id: sessionId }).then((_sessionData) => {
                setNumberPlayers(parseInt(_sessionData.numberPlayers));
                setSessionData({
                    ...sessionData,
                    sessionId: sessionId as string,
                    channelId: channelId as string,
                    questionSessionId: _sessionData.questionSessionId
                    });
            });
            setChannelId(channelId as string);

            console.log('JoinGame sessionData state ', sessionData);
            // handleJoinGame({ channelId });
        }
    }, [location]);

    const handleJoinGame = async (data: any) => {
        if (web3auth) {
            await enterChannelListenerWrapper(web3auth, data);

            // Generate questions
            generateQuestions({topics: selectedChips})
            .then((result) => {
                // console.log('generateQuestions response: ', result);
                addQuestions({id: sessionData?.questionSessionId, column: 1, topics: result});
            });
            // Update topics to Game session
            await updateTopics({id:sessionData?.sessionId, topics: selectedChips})
            // console.log('updatedTopics response:', addTopicResponse);
            setJoined(true);
        }
    };

    const handleJoinButtonClick = () => {
        joinIfAlreadyActiveGame();
        if (channelId !== '') {
            handleJoinGame({ channelId });
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
                    if(web3auth) {
                        const userInfo = await login(web3auth);
                        localStorage.setItem('userInfo', JSON.stringify(userInfo));
                        if (sessionData){
                          setSessionData({ ...sessionData, clientId: userInfo.email });
                        }
                    }

                    navigate('/aigame');
                }
            } catch (error) {
                console.log("joinIfAlreadyActiveGame - Error getting session: ", error);
            }
            
        }
        
    }

    const WaitingMessage = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>We are waiting for other players to join...</p>
            </div>
            
        );
    };

    return (
        joined ? <WaitingMessage /> :
        <div>
            <h1>Select topics and Join</h1>
            <input type="text" placeholder="Channel id" value={channelId} onChange={e => setChannelId(e.target.value)} />
            

            <Modal opened={opened} onClose={close} title="Pick topic" radius={'lg'} padding={'xl'}>
                <ModalContent setSelectedChips={setSelectedChips} numberOfPlayers={numberPlayers}></ModalContent>
                {/* Modal content */}
            </Modal>
            <Group justify="center">
                <Badge size="lg" radius="lg" variant="dot">Selected topics: {selectedChips.join(', ')}</Badge>
                <Button onClick={open}>Pick a topic</Button>
            </Group>

            <Button onClick={handleJoinButtonClick} variant="gradient" gradient={{ from: 'orange', to: 'red' }}>Join</Button>
        </div>

    );
};

export default JoinGame;


/**
 * https://helpful-knowing-ghost.ngrok-free.app/joingame?sessionId=mk-pbid-de8a7ec4-79c3-44c8-95bf-8a037ade0dc2&channelId=tm-chid-e20516c1-b458-47ea-8c08-e0a2f1dd4dfa
 */