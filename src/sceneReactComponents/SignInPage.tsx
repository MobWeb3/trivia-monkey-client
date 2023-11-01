import React, { useContext } from 'react';
import { Image } from '@mantine/core';
import './SignInPage.css';
import { CustomButton } from '../components/CustomButton';
import { login } from '../utils/Web3AuthAuthentication';
import { SignerContext } from '../components/SignerContext';
import { useNavigate } from 'react-router-dom';
import monkeyTriviaLogo from '../assets/Screens/signin/monkey-trivia-arched-name-400x200.png';
import mobweb3Logo from '../assets/Screens/signin/monkey-trivia-by-mobweb3-yellowcolorbackground-200x40.png';
import mobweb3LogoM from '../assets/Screens/signin/monkey-trivia-mobweb3-logo-200x200.png';

export const SignInPage = () => {
    const { web3auth } = useContext(SignerContext);
    // const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});    // const [, setProvider] = useState<SafeEventEmitterProvider | null>(null);
    const navigate = useNavigate();

    const handleSignIn = async () => {
        if (web3auth !== null) {
            await login(web3auth);
        }
        navigate('/playlobby');
    }

    return (
        <ControlButtons
            onSignInClick={handleSignIn}
        />
    );
}

interface ControlButtonsProps {
    onSignInClick: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
    onSignInClick: handlePlayClick,
}) => {
    return (
        <div className='signInPage'>

            <Image      className='topImage'
                        radius="md"
                        src={monkeyTriviaLogo}
                    />

            <CustomButton
                onClick={handlePlayClick}
                > Sign in to play</CustomButton>

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



export default SignInPage;