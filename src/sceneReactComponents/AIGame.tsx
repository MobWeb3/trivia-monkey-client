import './SpinWheel.css';
import '../sceneConfigs/AIGameConfig';
import { useContext, useEffect, useState } from 'react';
import GameInstance from '../sceneConfigs/AIGameConfig';
import { SessionDataContext } from '../components/SessionDataContext';
import { Button } from '@mantine/core';
import QuestionModal from '../components/QuestionModal';

function AIGame() {

    const { sessionData } = useContext(SessionDataContext);
    const [game, setGame] = useState<Phaser.Game | null>(null);
    const [showQuestionModal, setShowQuestionModal] = useState(false);

    const handleQuestionClick = () => {
        setShowQuestionModal(true);
    }
    
    const handleCloseQuestionModal = () => {
        setShowQuestionModal(false);
    }
    
    const handleAnswerSubmit = () => {
        // Handle answer submission here
    }


    useEffect(() => {
        console.log('sessionData', sessionData);
        // console.log('passedState', passedState); // This will log the state passed during navigation

        if (game === null) {
            setGame(GameInstance.startScene('AIGameScene', sessionData));
        }

    });


    return (
        <div style={{ position: 'relative' }}>
            <Button onClick={handleQuestionClick}>
                Show Question
            </Button>
            <QuestionModal 
                open={showQuestionModal} 
                onClose={handleCloseQuestionModal} 
                onAnswerSubmit={handleAnswerSubmit}
            />
            <div id="phaser-container" className="App"></div>

        </div>
    );
}

export default AIGame;