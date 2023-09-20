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
        setSessionData({sessionId: 'mk-pbid-40d2d7e1-b161-40c1-b7bd-3b7b7e5a7fe4', clientId: 'norman.lopez.krypo@gmail.com'})
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