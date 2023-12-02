import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import { Flex, Image } from '@mantine/core';
import './PlayLobby.css'
import monkeyTriviaLogo from '../assets/Screens/signin/monkey-trivia-arched-name-400x200.png';
import { useContext } from "react";
import { SignerContext } from "../components/SignerContext";

const PlayLobbyScene = () => {
    const navigate = useNavigate();
    const { web3auth } = useContext(SignerContext);

    const handleCreateGameClick = () => {
        console.log('Create Game');
        // Navigate to CreateGame
        navigate('/creategame');
    };


    const logout = async () => {
        if (!web3auth) {
            console.log('web3auth not initialized yet');
            return;
        }
        try {
            await web3auth.logout();
        } catch (error) {
            console.error(error);
        }
        localStorage.removeItem('userInfo');
        localStorage.removeItem('web3auth');
        localStorage.removeItem('sessionData');
        console.log('Disconnected');
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

                <CustomButton onClick={handleCreateGameClick}>Settings</CustomButton>
                <CustomButton onClick={() => { logout(); navigate('/'); }}>Disconnect</CustomButton>
            </Flex>
        </div>
    );

};

export default PlayLobbyScene;