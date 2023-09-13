import './SpinWheel.css';
import '../sceneConfigs/SpinWheelConfig';
import { useContext, useEffect, useState } from 'react';
import GameInstance from '../sceneConfigs/SpinWheelConfig';
import { SessionDataContext } from '../components/SessionDataContext';
import { Button } from '@mantine/core';
import { addMessageListener } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';
import { useNavigate } from 'react-router-dom';
import { publishStartGameAI, subscribeToStartGameAI } from '../ably/AblyMessages';

function SpinWheel() {

    const { sessionData } = useContext(SessionDataContext);
    const [game, setGame] = useState<Phaser.Game | null>(null);
    const [mayStartGame, setMayStartGame] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('sessionData', sessionData);
        if (game === null) {
            setGame(GameInstance.startScene('SpinWheelScene', sessionData));
        }
        const enableStartGameButton = () => {
            console.log('enableStartGameButton');
            setMayStartGame(true);
        };

        addMessageListener(Messages.MAY_START_GAME, enableStartGameButton);

        console.log('SpinWheel useEffect');

        if ( sessionData && sessionData.clientId && sessionData.channelId) {
            const { clientId, channelId } = sessionData;
            subscribeToStartGameAI(clientId, channelId);
        }

        const handleOpenAIGame = (event:any) => {
            console.log('Naviagting to Game', event.detail);
            navigate('/aigame');
        };

        window.addEventListener(Messages.OPEN_AI_GAME, handleOpenAIGame);

        // Cleanup listener when component unmounts
        return () => {
            window.removeEventListener(Messages.OPEN_AI_GAME, handleOpenAIGame);
        };
    }, [mayStartGame]);

    const handleStartGame = () => {
        console.log('handleStartGame');
        console.log('handleStartGame SpinWheel sesionData: ', sessionData);
        if ( sessionData === null ) return;
        const { clientId, channelId } = sessionData;
        if ( clientId && channelId ) {
            navigate('/aigame');
            publishStartGameAI(clientId, channelId)
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {mayStartGame && (
                <Button
                    style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)' }}
                    loading={false}
                    variant="gradient"
                    gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                    onClick={handleStartGame}
                >
                    Start Game
                </Button>
            )}
            <div id="phaser-container" className="App"></div>
        </div>
    );
}

export default SpinWheel;