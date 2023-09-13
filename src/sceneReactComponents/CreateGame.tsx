import { useContext, useEffect, useState } from 'react';
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

const CreateGame = () => {
    const [nickname, setNickname] = useState('');
    const [numberPlayers, setNumberPlayers] = useState('');
    const [pointsToWin, setPointsToWin] = useState('');
    const { web3auth } = useContext(SignerContext);
    const { setSessionData } = useContext(SessionDataContext);
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedChip, setSelectedChip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sesssionCreated, setSessionCreated] = useState(false);

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

    const handleCreateChannel = async (data: any) => {
        if (web3auth) {
            await createChannelListenerWrapper(web3auth, data);
        }
    };

    const handlePlayButtonClick = async () => {
        setLoading(true);

        console.log('handlePlayButtonClick A');
        if (nickname !== '' && numberPlayers !== '' && pointsToWin !== '') {
            console.log('handlePlayButtonClick B');
            await handleCreateChannel({ nickname, numberPlayers, pointsToWin, topic: selectedChip });
            setSessionCreated(true);
        }
        setLoading(false);
    };

    const WaitingMessage = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>We are waiting for other players to join...</p>
            </div>

        );
    };


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
                    sesssionCreated ? <WaitingMessage /> : (
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