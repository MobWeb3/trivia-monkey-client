import React, { useContext } from 'react';
import { SignerContext } from '../components/SignerContext';
import { useNavigate } from 'react-router-dom';
import { SessionData } from './SessionData';
import useLocalStorageState from 'use-local-storage-state';
import './SignInPage.css';
import { CustomButton } from '../components/CustomButton';


export const SignInPage = () => {
    const { web3auth, loggedIn, setLoggedIn, setUserInfo } = useContext(SignerContext);
    const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});    // const [, setProvider] = useState<SafeEventEmitterProvider | null>(null);
    const navigate = useNavigate();

    const handlePlayClick = async () => {
        navigate("/playlobby");
    }

    const handleDisconnectClick = async () => {
        await logout();
        if (sessionData) setSessionData(undefined);
    }

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

        // setProvider(null);
        setLoggedIn(false);
        setUserInfo(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('web3auth');
        console.log('Disconnected');
    };

    return (
            <ControlButtons
                loggedIn={loggedIn}
                handlePlayClick={handlePlayClick}
                handleDisconnectClick={handleDisconnectClick}
            />
    );
}

interface ControlButtonsProps {
    loggedIn: boolean;
    handlePlayClick: () => void;
    handleDisconnectClick: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
    handlePlayClick,
    handleDisconnectClick
}) => {
    return (
        <div className='signInPage'>
            {/* <h1 style={{ textAlign: 'center' }}>{!loggedIn ? 'Site is not connected' : 'Site is connected'}</h1>
            <Button size="xxl">Regular md</Button>
            <button
                key={3}
                style={{ backgroundColor: '#ffffff' }}
                onClick={handleDisconnectClick}
            >
                Disconnect
            </button> */}

            <CustomButton
                // onClick={handlePlayClick}
            > Sign in to play</CustomButton>
        </div>
    );
};

export default SignInPage;