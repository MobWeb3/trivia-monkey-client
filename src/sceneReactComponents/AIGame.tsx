import './SpinWheel.css';
import '../sceneConfigs/AIGameConfig';
import { useContext, useEffect, useRef, useState } from 'react';
import GameInstance from '../sceneConfigs/AIGameConfig';
import { SessionDataContext } from '../components/SessionDataContext';
import { Button } from '@mantine/core';
import QuestionModal from '../components/QuestionModal';

function AIGame() {

    const { sessionData } = useContext(SessionDataContext);
    const [showQuestionModal, setShowQuestionModal] = useState(false);

    const sceneAddedRef = useRef(false);

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
        console.log('AIGame loaded: ', sessionData);

        if (!sceneAddedRef.current) { // Check if the scene has been added
            GameInstance.getInstance();
            console.log('AIGame add scene session', sessionData);
            GameInstance.addScene(sessionData ?? "");
            sceneAddedRef.current = true;
        }

    }, [sessionData]);


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