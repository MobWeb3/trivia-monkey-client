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
        navigate('/aigame');
        setSessionData({sessionId: 'mk-pbid-14ff981a-ba4b-4979-9d82-37ee9539e36d', clientId: 'noell.lpz@gmail.com'})
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