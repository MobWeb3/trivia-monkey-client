import './SpinWheel.css';
import '../sceneConfigs/AIGameConfig';
import { useContext, useEffect, useState } from 'react';
import GameInstance from '../sceneConfigs/AIGameConfig';
import { SessionDataContext } from '../components/SessionDataContext';
import { Button } from '@mantine/core';
import { addMessageListener } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';
import { useNavigate } from 'react-router-dom';

function AIGame() {

    const { sessionData } = useContext(SessionDataContext);
    const [game, setGame] = useState<Phaser.Game | null>(null);
    const [mayStartGame, setMayStartGame] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('sessionData', sessionData);
        if (game === null) {
            setGame(GameInstance.startScene('AIGameScene', sessionData));
        }

    });


    return (
        <div style={{ position: 'relative' }}>
            <div id="phaser-container" className="App"></div>
        </div>
    );
}

export default AIGame;