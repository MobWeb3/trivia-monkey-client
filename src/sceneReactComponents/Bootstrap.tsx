import React, { useContext, useState } from 'react';
import { SafeEventEmitterProvider } from '@web3auth/base';
import { SignerContext } from '../components/SignerContext';
import { getRPCProviderOwner, getZeroDevSigner } from '@zerodevapp/sdk';
import { getConnectedPublicKey } from '../ably/ChannelListener';
import { createUser, userExists } from '../polybase/UserHandler';
import { useNavigate } from 'react-router-dom';

export const Bootstrap = () => {
    const { signer, web3auth, setSigner, loggedIn, setLoggedIn, setUserInfo } = useContext(SignerContext);
    const [, setProvider] = useState<SafeEventEmitterProvider | null>(null);
    const navigate = useNavigate();

    const handlePlayClick = async () => {
        navigate("/playlobby");
    }

    const handleSettingsClick = async () => {
        
    }

    const handleConnectNowClick = async () => {
        console.log('Connect Now');
        const userData = await login();
        if (!userData.clientId) {
            console.log('publicKey not initialized yet');
            return;
        }
        const userExist = await userExists(userData.clientId);
        if (!userExist) {
            console.log('user does not exist, creating user');
            // create user
            await createUser(userData);
        }
    }

    const handleDisconnectClick = async () => {
        await logout();
    }

    const login = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return {};
        }
        const web3authProvider = await web3auth.connect();
        setProvider(web3authProvider);
        setLoggedIn(true);

        const userInfo = await web3auth.getUserInfo();
        setUserInfo(userInfo);

        const evmChain = false;

        if (evmChain) {
            const _signer = await getZeroDevSigner({
                projectId: "5682ee04-d8d3-436a-ae63-479e063a23c4",
                owner: getRPCProviderOwner(web3auth.provider),
            })

            setSigner(_signer);
            console.log("signer created: ", signer);
            console.log("signer address", await _signer.getAddress());
        } else {
            const publicKey = await getConnectedPublicKey(web3auth);
            console.log(`publick key: ${publicKey?.toString()}`);
            // console.log(`userInfo: ${JSON.stringify(userInfo)}`);
            return {
                clientId: userInfo.email ?? "",
                name: userInfo.name ?? "",
                publicKey: publicKey ?? ""
            }
        }
        return {}
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

        setProvider(null);
        setLoggedIn(false);
        console.log('Disconnected');
    };

    return (
            <ControlButtons
                loggedIn={loggedIn}
                handlePlayClick={handlePlayClick}
                handleSettingsClick={handleSettingsClick}
                handleConnectNowClick={handleConnectNowClick}
                handleDisconnectClick={handleDisconnectClick}
            />
    );
}


interface ControlButtonsProps {
    loggedIn: boolean;
    handlePlayClick: () => void;
    handleSettingsClick: () => void;
    handleConnectNowClick: () => void;
    handleDisconnectClick: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
    loggedIn,
    handlePlayClick,
    handleSettingsClick,
    handleConnectNowClick,
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
            <button
                key={2}
                style={{ backgroundColor: '#ffffff' }}
                onClick={handleConnectNowClick}
            >
                Connect Now
            </button>
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