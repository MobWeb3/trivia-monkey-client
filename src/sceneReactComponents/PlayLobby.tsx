import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import { Flex, Image } from '@mantine/core';
import './PlayLobby.css'

const PlayLobbyScene = () => {
    const navigate = useNavigate();

    const handleCreateGameClick = () => {
        console.log('Create Game');
        // Navigate to CreateGame
        navigate('/creategame');
    };

    return (
        <div className="playLobbyPage">
            <div className="monkeyTriviaLogo">
                <Image
                    radius="md"
                    src="src/assets/Screens/signin/monkey-trivia-arched-name-400x200.png"
                />
            </div>
            <Flex
                mih={50}
                gap="md"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
            >
                <CustomButton onClick={handleCreateGameClick}>Create Game</CustomButton>

                <CustomButton onClick={handleCreateGameClick}>Settings</CustomButton>
            </Flex>

            <div className="mobweb3Logo">
                <Image
                    radius="md"
                    src="src/assets/Screens/signin/monkey-trivia-by-mobweb3-yellowcolorbackground-200x40.png"
                />
            </div>
            <div className="mobweb3LogoM">
                <Image
                    radius="md"
                    src="src/assets/Screens/signin/monkey-trivia-mobweb3-logo-200x200.png"
                />
            </div>

        </div>
    );

};

export default PlayLobbyScene;