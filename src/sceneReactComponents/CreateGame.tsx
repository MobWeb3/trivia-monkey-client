import { useContext, useEffect, useState } from 'react';
import { createChannelListenerWrapper } from '../ably/ChannelListener';
import { SignerContext } from '../components/SignerContext';
import { Messages } from '../utils/Messages';
import { useNavigate } from 'react-router-dom';
import { SessionDataContext } from '../components/SessionDataContext';
import { Badge, Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ModalContent from '../components/ModalContent';

const CreateGame = () => {
    const [nickname, setNickname] = useState('');
    const [numberPlayers, setNumberPlayers] = useState('');
    const [pointsToWin, setPointsToWin] = useState('');
    const { web3auth } = useContext(SignerContext);
    const { setSessionData } = useContext(SessionDataContext);
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedChip, setSelectedChip] = useState(null);

    useEffect(() => {
        const handleAllPlayersJoined = (event: any) => {
            console.log('All players have joined', event.detail);
            setSessionData(event.detail);
            // Handle the event here
            navigate('/spinwheel');
        };

        window.addEventListener(Messages.ALL_PLAYERS_JOINED, handleAllPlayersJoined);

        console.log('selectedChip', selectedChip);

        // Cleanup listener when component unmounts
        return () => {
            window.removeEventListener(Messages.ALL_PLAYERS_JOINED, handleAllPlayersJoined);
        };
    }, [selectedChip]);

    const handleCreateChannel = async (data: any) => {
        if (web3auth) {
            await createChannelListenerWrapper(web3auth, data);
        }
    };

    const handlePlayButtonClick = () => {
        if (nickname !== '' && numberPlayers !== '' && pointsToWin !== '') {
            handleCreateChannel({ nickname, numberPlayers, pointsToWin });
        }
    };

    return (
        <div>
            <h1>Please enter your name</h1>
            <input type="text" placeholder="Enter nickname" value={nickname} onChange={e => setNickname(e.target.value)} />
            <input type="text" placeholder="Enter number of players" value={numberPlayers} onChange={e => setNumberPlayers(e.target.value)} />
            <input type="text" placeholder="Enter points to win" value={pointsToWin} onChange={e => setPointsToWin(e.target.value)} />
            <Modal opened={opened} onClose={close} title="Pick topic" radius={'lg'} padding={'xl'}>
                <ModalContent setSelectedChip={setSelectedChip}></ModalContent>
                {/* Modal content */}
            </Modal>
            <Group position="center">
                <Badge size="lg" radius="lg" variant="dot">Selected topic: {selectedChip}</Badge>
                <Button onClick={open}>Pick a topic</Button>
            </Group>
            <button name="playButton" onClick={handlePlayButtonClick}>Create Game</button>
            <p>Welcome {nickname}! Number of players: {numberPlayers}</p>
        </div>
    );
};

export default CreateGame;