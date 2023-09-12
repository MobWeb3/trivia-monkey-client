import './SpinWheel.css';
import '../sceneConfigs/AIGameConfig';
import { useContext, useEffect, useState } from 'react';
import GameInstance from '../sceneConfigs/AIGameConfig';
import { SessionDataContext } from '../components/SessionDataContext';

function AIGame() {

    const { sessionData } = useContext(SessionDataContext);
    const [game, setGame] = useState<Phaser.Game | null>(null);

    useEffect(() => {
        console.log('sessionData', sessionData);
        // console.log('passedState', passedState); // This will log the state passed during navigation

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