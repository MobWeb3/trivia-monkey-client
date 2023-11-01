import React, { useContext } from 'react';
import { Image } from '@mantine/core';
import './SignInPage.css';
import { CustomButton } from '../components/CustomButton';
import { login } from '../utils/Web3AuthAuthentication';
import { SignerContext } from '../components/SignerContext';


export const SignInPage = () => {
    const { web3auth } = useContext(SignerContext);
    // const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});    // const [, setProvider] = useState<SafeEventEmitterProvider | null>(null);
    // const navigate = useNavigate();

    const handleSignIn = async () => {
        if (web3auth !== null) {
            await login(web3auth);
        }
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
            <div className="monkeyTriviaLogo">
                <Image
                    radius="md"
                    src="src/assets/Screens/signin/monkey-trivia-arched-name-400x200.png"
                />
            </div>

            <CustomButton
            onClick={handlePlayClick}
            > Sign in to play</CustomButton>

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

export default SignInPage;