import './SpinWheel.css';
import '../SpinWheelConfig';
import { useContext, useEffect, useState } from 'react';
import GameInstance from '../SpinWheelConfig';
import { SessionDataContext } from '../components/SessionDataContext';

function SpinWheel() {

    const { sessionData } = useContext(SessionDataContext);
    const [game, setGame] = useState<Phaser.Game | null>(null);
    
    useEffect(() => {
        console.log('sessionData', sessionData);
        if (game === null) {
            setGame(GameInstance.startScene('SpinWheelScene', sessionData ));
        }

    }, []);

    return (
        <>
            <div id="phaser-container" className="App"></div>
        </>
    );
}

export default SpinWheel;