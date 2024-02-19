import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import { Flex, Image } from '@mantine/core';
import './PlayLobby.css'
import monkeyTriviaLogo from '../assets/Screens/signin/monkey-trivia-arched-name-400x200.png';
import { logout } from "../authentication/Logout";

const PlayLobbyScene = () => {
    const navigate = useNavigate();

    const handleCreateGameClick = () => {
        console.log('Create Game');
        // Navigate to CreateGame
        navigate('/creategame');
    };

    const handleProfileClick = () => {
        console.log('Go to profile page');
        // Navigate to CreateGame
        navigate('/profile');
    };

    return (
        <div className="playLobbyPage">
            <Flex
                mih={50}
                gap="md"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
            >
                <Image
                    radius="md"
                    src={monkeyTriviaLogo}
                />
                <CustomButton onClick={handleCreateGameClick}>Create Game</CustomButton>
                <CustomButton onClick={handleProfileClick}>Profile</CustomButton>
                <CustomButton onClick={()=> {}}>Settings</CustomButton>
                <CustomButton onClick={async () => { await logout(); navigate('/'); }}>Disconnect</CustomButton>
            </Flex>
        </div>
    );

};

export default PlayLobbyScene;