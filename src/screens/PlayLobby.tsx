import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import { Flex, Image } from '@mantine/core';
import './PlayLobby.css'
import monkeyTriviaLogo from '../assets/Screens/signin/monkey-trivia-arched-name-400x200.png';
import mobweb3Logo from '../assets/Screens/signin/monkey-trivia-by-mobweb3-yellowcolorbackground-200x40.png';
import mobweb3LogoM from '../assets/Screens/signin/monkey-trivia-mobweb3-logo-200x200.png';
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
        console.log('Disconnected');
    };

    return (
        <div className="playLobbyPage">
            <div className="monkeyTriviaLogo">
                <Image
                    radius="md"
                    src={monkeyTriviaLogo}
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
                <CustomButton onClick={()=>{logout(); navigate('/');}}>Disconnect</CustomButton>
            </Flex>

            <div className="mobweb3Logo">
                <Image
                    radius="md"
                    src={mobweb3Logo}
                />
            </div>
            <div className="mobweb3LogoM">
                <Image
                    radius="md"
                    src={mobweb3LogoM}
                />
            </div>
        </div>
    );

};

export default PlayLobbyScene;