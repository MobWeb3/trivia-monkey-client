import './SpinWheel.css';
import '../sceneConfigs/AIGameConfig';
import { useContext, useEffect, useRef, useState } from 'react';
import GameInstance from '../sceneConfigs/AIGameConfig';
import { SessionDataContext } from '../components/SessionDataContext';
import QuestionModal from '../components/QuestionModal';
import { getQuestion } from '../polybase/QuestionsHandler';
import { Question } from '../game-domain/Question';
import { addMessageListener, removeMessageListener } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';
import { Button } from '@mantine/core';
import { getNextTurnPlayerId } from '../polybase/SessionHandler';
import { publishTurnCompleted } from '../ably/AblyMessages';

function AIGame() {

    const { sessionData } = useContext(SessionDataContext);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [chosenTopic, setChosenTopic] = useState<string | null>(null);

    const sceneAddedRef = useRef(false);

    const handleShowQuestion = async (topic:string) => {

        // console.log('handleShowQuestion', event.detail.topic);
        // setChosenTopic(event.detail.topic);
        const question: Question = await getQuestion({id:sessionData?.questionSessionId, topic});
        setCurrentQuestion(question);
        setShowQuestionModal(true);
        setChosenTopic(topic);
    }
    
    const finishTurnAndSaveState = async () => {
        setShowQuestionModal(false);
        // Update turn on polybase
        const {nextTurnPlayerId} = await getNextTurnPlayerId({id: sessionData?.sessionId});
        // Publish turn completed // we know clientId is not null because we checked isPlayerTurn
        if(sessionData?.clientId && sessionData.channelId) {
            await publishTurnCompleted(sessionData?.clientId, sessionData.channelId, {nextTurnPlayerId});
        } 
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

    useEffect(() => {

        const showQuestion = async (event: any) => {
            console.log('showQuestion event: ', event);
            await handleShowQuestion(event?.topic);
        }

        // const hideQuestion = async () => {
        //     setShowQuestionModal(false);
        // }

        addMessageListener(Messages.SHOW_QUESTION, showQuestion);
        addMessageListener(Messages.HIDE_QUESTION, finishTurnAndSaveState);


        return () => {
            removeMessageListener(Messages.SHOW_QUESTION, showQuestion);
            removeMessageListener(Messages.HIDE_QUESTION, finishTurnAndSaveState)
        };

    });

    return (
        <div style={{ position: 'relative' }}>
            <Button onClick={() => handleShowQuestion("History")}>
                Show Question
            </Button>
            <QuestionModal 
                open={showQuestionModal} 
                onClose={finishTurnAndSaveState} 
                question={currentQuestion}
                topic={chosenTopic}
                onExpire={() => finishTurnAndSaveState()}
            />
            <div id="phaser-container" className="App"></div>

        </div>
    );
}

export default AIGame;