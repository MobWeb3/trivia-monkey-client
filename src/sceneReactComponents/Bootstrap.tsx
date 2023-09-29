import React, { useContext } from 'react';
import { SignerContext } from '../components/SignerContext';
import { useNavigate } from 'react-router-dom';
import createPersistedState from 'use-persisted-state';
import { SessionData } from './SessionData';

const useSessionDataState = createPersistedState<SessionData | null>('sessionData');

export const Bootstrap = () => {
    const { web3auth, loggedIn, setLoggedIn, setUserInfo } = useContext(SignerContext);
    const [sessionData, setSessionData] = useSessionDataState(null);
    // const [, setProvider] = useState<SafeEventEmitterProvider | null>(null);
    const navigate = useNavigate();

    const handlePlayClick = async () => {
        navigate("/playlobby");
    }

    const handleSettingsClick = async () => {
        
    }

    const handleDisconnectClick = async () => {
        await logout();
        if (sessionData) setSessionData(null);
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
                handleSettingsClick={handleSettingsClick}                handleDisconnectClick={handleDisconnectClick}
            />
    );
}


interface ControlButtonsProps {
    loggedIn: boolean;
    handlePlayClick: () => void;
    handleSettingsClick: () => void;
    handleDisconnectClick: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
    handlePlayClick,
    handleSettingsClick,
    handleDisconnectClick
}) => {
    return (
        <div>
            {/* <h1 style={{ textAlign: 'center' }}>{!loggedIn ? 'Site is not connected' : 'Site is connected'}</h1> */}
            <button
                key={0}
                style={{ backgroundColor: '#ffffff' }}
                onClick={handlePlayClick}
            >
                Play
            </button>
            <button
                key={1}
                style={{ backgroundColor: '#ffffff' }}
                onClick={handleSettingsClick}
            >
                Settings
            </button>
            {/* <button
                key={2}
                style={{ backgroundColor: '#ffffff' }}
                onClick={handleConnectNowClick}
            >
                Connect Now
            </button> */}
            <button
                key={3}
                style={{ backgroundColor: '#ffffff' }}
                onClick={handleDisconnectClick}
            >
                Disconnect
            </button>
        </div>
    );
};

export default Bootstrap;