import { useContext, useEffect, useRef, useState } from 'react';
import { createChannelListenerWrapper } from '../ably/ChannelListener';
import { SignerContext } from '../components/SignerContext';
import { Messages } from '../utils/Messages';
import { useNavigate } from 'react-router-dom';
import { SessionDataContext } from '../components/SessionDataContext';
import { Badge, Button, Group, Input, Modal, SegmentedControl, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ModalContent from '../components/ModalContent';
import { NumberInputComponent } from '../components/NumberInput';
import { IconPacman } from '@tabler/icons-react';
import QRCodeStyling from "qr-code-styling";
import { addTopicToQuestionSession, createQuestionSession } from '../polybase/QuestionsHandler';
import { generateQuestions } from '../game-domain/GenerateQuestionsHandler';

const CreateGame = () => {
    const [nickname, setNickname] = useState('');
    const [numberPlayers, setNumberPlayers] = useState('');
    const [pointsToWin, setPointsToWin] = useState('');
    const { web3auth } = useContext(SignerContext);
    const {sessionData, setSessionData } = useContext(SessionDataContext);
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedChip, setSelectedChip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sessionCreated, setSessionCreated] = useState(false);
    const ref = useRef(null); //qr code ref

    // useEffect(() => {
    //     if (ref.current) {
    //         qrCode.append(ref.current);
    //     }
    // }, []);

    useEffect(() => {
        const handleAllPlayersJoined = (event: any) => {
            console.log('All players have joined', event.detail);
            setSessionData(event.detail);
            // Handle the event here
            navigate('/spinwheel');
        };

        window.addEventListener(Messages.ALL_PLAYERS_JOINED, handleAllPlayersJoined);

        // Cleanup listener when component unmounts
        return () => {
            window.removeEventListener(Messages.ALL_PLAYERS_JOINED, handleAllPlayersJoined);
        };
    }, [selectedChip, pointsToWin, nickname]);

    useEffect(() => {
        qrCode.update({
          data:`https://helpful-knowing-ghost.ngrok-free.app/joingame?sessionId=${sessionData?.sessionId}&channelId=${sessionData?.channelId}`
        });
        if (ref.current) {
            qrCode.append(ref.current);
        }
      }, [sessionCreated]);

    const handleCreateChannel = async (data: any) => {
        if (web3auth) {
            const {sessionId, channelId, clientId} =  await createChannelListenerWrapper(web3auth, data);
            console.log('handleCreateChannel: ', sessionId, channelId);
            setSessionData({sessionId, channelId, clientId});
            return { sessionId, channelId, clientId };
        }
        return {};
    };

    const handlePlayButtonClick = async () => {
        setLoading(true);

        // console.log('handlePlayButtonClick A');
        if (nickname !== '' && numberPlayers !== '' && pointsToWin !== '') {
            // console.log('handlePlayButtonClick B');
            const sessionData = await handleCreateChannel({ nickname, numberPlayers, pointsToWin, topic: selectedChip });
            console.log('handlePlayButtonClick C, sessionData', sessionData);
            // Create AI session question database record in Polybase
            if (sessionData){
                console.log('entered createQuestionSession');
                const response = await createQuestionSession({ 
                    sessionId: sessionData.sessionId,
                    clientId: sessionData.clientId
                }); 
                
                if (response){
                    const questionSessionId = response.recordData.data.id;
                    // Deploy generation of AI questions
                    generateQuestions({topic: selectedChip}).then((response) => {
                        console.log('generateQuestions response: ', response);
                        addTopicToQuestionSession({id: questionSessionId, column: 1, topic: response});
                    });
                } 

            }
            console.log('handlePlayButtonClick setSessionCreated');
            setSessionCreated(true);
        }
        setLoading(false);
    };

    const WaitingMessage = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>We are waiting for other players to join...</p>
                <div ref={ref} />
            </div>
            
        );
    };

    const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: "https://helpful-knowing-ghost.ngrok-free.app/joingame?channelId=1234",
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
    });

    return (
        <>
            {
                loading ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection:'column' }}>
                        <p>Creating game session... </p>
                        <div>
                            <Loader variant="bars" />
                        </div>
                    </div> :
                    sessionCreated ? <WaitingMessage /> : (
                        <div>
                            <h1>Let's create your game...</h1>
                            <Input
                                icon={<IconPacman />}
                                placeholder="Your Name"
                                radius="md"
                                onChange={e => setNickname(e.currentTarget.value)} />
                            <NumberInputComponent setNumberSelected={setNumberPlayers}></NumberInputComponent>
                            <SegmentedControl
                                data={[
                                    { value: '10', label: '10' },
                                    { value: '20', label: '20' },
                                    { value: '30', label: '30' },
                                ]}
                                onChange={(value) => setPointsToWin(value)} />
                            {/* <input type="text" placeholder="Enter points to win" value={pointsToWin} onChange={e => setPointsToWin(e.target.value)} /> */}
                            <Modal opened={opened} onClose={close} title="Pick topic" radius={'lg'} padding={'xl'}>
                                <ModalContent setSelectedChip={setSelectedChip}></ModalContent>
                                {/* Modal content */}
                            </Modal>
                            <Group position="center">
                                <Badge size="lg" radius="lg" variant="dot">Selected topic: {selectedChip}</Badge>
                                <Button onClick={open}>Pick a topic</Button>
                            </Group>
                            <button onClick={handlePlayButtonClick}>Create Game</button>
                            <p>Welcome {nickname}! Number of players: {numberPlayers} Points to Win: {pointsToWin}</p>
                        </div>
                    )
            }


        </>
    );
};

export default CreateGame;