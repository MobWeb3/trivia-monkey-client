import { useNavigate } from "react-router-dom";

const PlayLobbyScene = () => {
    const navigate = useNavigate();

    const handleCreateGameClick = () => {
        console.log('Create Game');
        // Navigate to CreateGame
        navigate('/creategame');
    };

    const handleJoinGameClick = () => {
        console.log('Join Game');
        // Navigate to JoinGame
    };

    const handleChooseTurnClick = () => {
        console.log('Choose Turn');
        // Set data and navigate to SpinWheelScene
    };

    const handleMockGameAIClick = () => {
        console.log('Mock game AI');
        // Set data and navigate to AIGameScene
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