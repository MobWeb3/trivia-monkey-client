import './SpinWheel.css';
import '../sceneConfigs/SpinWheelConfig';
import { useEffect, useState } from 'react';
import GameInstance from '../sceneConfigs/SpinWheelConfig';
import { Button, Loader } from '@mantine/core';
import { addMessageListener, removeMessageListener } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';
import { useNavigate } from 'react-router-dom';
import { publishStartGameAI, subscribeToStartGameAI } from '../ably/AblyMessages';
import { setCurrentTurnPlayerId, updatePlayerListOrder, updateSessionPhase } from '../polybase/SessionHandler';
import { SessionData } from './SessionData';
import { SessionPhase } from '../game-domain/SessionPhase';
import useLocalStorageState from 'use-local-storage-state';

function SpinWheel() {

    const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const [game, setGame] = useState<Phaser.Game | null>(null);
    const [mayStartGame, setMayStartGame] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Add this line

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

        const handleOpenAIGame = async (event:any) => {
            // update order list        
            //make call to polybase to set the first in turn
            setIsLoading(true);
            if (sessionData) {
                const playerList = (await updatePlayerListOrder({id: sessionData.sessionId})).playerList;
                console.log('playerList', playerList);
                // set the first player in the list as the current turn player
                await setCurrentTurnPlayerId({id: sessionData.sessionId, playerId: playerList[0]})
                // if all players have selected their turn, then we can proceed to the next phase.
                await updateSessionPhase({ id: sessionData.sessionId, newPhase: SessionPhase.GAME_ACTIVE });
            }
            setIsLoading(false);
            console.log('Naviagting to Game', event.detail);
            navigate('/aigame');
        };

        window.addEventListener(Messages.START_GAME_AI, handleOpenAIGame);

        // Cleanup listener when component unmounts
        return () => {
            window.removeEventListener(Messages.START_GAME_AI, handleOpenAIGame);
            removeMessageListener(Messages.MAY_START_GAME, enableStartGameButton);
        };
    }, [sessionData, game, navigate]);

    const handleStartGame = () => {
        console.log('handleStartGame');
        console.log('handleStartGame SpinWheel sesionData: ', sessionData);
        if ( sessionData === null ) return;
        const { clientId, channelId } = sessionData as SessionData;
        if ( clientId && channelId ) {
            navigate('/aigame');
            publishStartGameAI(clientId, channelId)
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            { isLoading ? <Loader /> :
            mayStartGame ? (
                <Button
                    style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)' }}
                    loading={false}
                    variant="gradient"
                    gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                    onClick={handleStartGame}
                >
                    Start Game
                </Button> ) : null
            }
            <div id="phaser-container" className="App"></div>
        </div>
    );
}

export default SpinWheel;