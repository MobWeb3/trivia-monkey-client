import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SessionDataContext } from "../components/SessionDataContext";

const PlayLobbyScene = () => {
    const navigate = useNavigate();
    const {setSessionData } = useContext(SessionDataContext);

    const handleCreateGameClick = () => {
        console.log('Create Game');
        // Navigate to CreateGame
        navigate('/creategame');
    };

    const handleJoinGameClick = () => {
        console.log('Join Game');
        // Navigate to JoinGame
        navigate('/joingame');
    };

    const handleChooseTurnClick = () => {
        console.log('Choose Turn');
        // Set data and navigate to SpinWheelScene
    };

    const handleMockGameAIClick = () => {
        console.log('Mock game AI');
        // Set data and navigate to AIGameScene
        setSessionData({
            sessionId: 'mk-pbid-de8a7ec4-79c3-44c8-95bf-8a037ade0dc2',
            clientId: 'norman.lopez.krypo@gmail.com',
            channelId: 'tm-chid-e20516c1-b458-47ea-8c08-e0a2f1dd4dfa',
            questionSessionId: 'Qn-01a8c310-6a9d-4853-a28d-906ed937580b'
        })

        navigate('/aigame');
    };

    return (
        <div>
            <button onClick={handleCreateGameClick}>Create Game</button>
            <button onClick={handleJoinGameClick}>Join Game</button>
            <button onClick={handleChooseTurnClick}>Choose Turn</button>
            <button onClick={handleMockGameAIClick}>Mock Game AI</button>
        </div>
    );

};

export default PlayLobbyScene;