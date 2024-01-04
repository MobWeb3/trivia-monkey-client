import React, { useContext } from 'react';
import './SignInPage.css';
import { CustomButton } from '../components/CustomButton';
import { SignerContext } from '../components/SignerContext';
import { useNavigate } from 'react-router-dom';
import monkeyTriviaLogo from '../assets/Screens/signin/monkey-trivia-arched-name-400x200.png';
import { getConnectedPublicKey } from '../utils/Web3AuthAuthentication';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from './SessionData';
import { getWeb3AuthSigner } from '../evm/Login';
import { AuthSessionData } from '../game-domain/AuthSessionData';
import { createUser, userExists } from '../mongo/Player';
import { Web3Auth } from '@web3auth/modal';

export const SignInPage = () => {
  const { web3auth, setWeb3auth } = useContext(SignerContext);
  const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
  const [authSessionData, setAuthSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});
  const navigate = useNavigate();

  const login = async () => {



    const isEvmChain = import.meta.env.VITE_APP_EVM_CHAIN === 'true';

    if (isEvmChain) {
      const web3authSigner = await getWeb3AuthSigner();
      const web3auth = web3authSigner.inner;
      await createPlayerIfNotExists(web3auth);

    } else {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return {};
      }
      await web3auth.connect();
      await createPlayerIfNotExists(web3auth);
    }
  };

  const createPlayerIfNotExists = async (web3authInstance: Web3Auth) => {
    const userInfo = await web3authInstance.getUserInfo();
    const publicKey = await getConnectedPublicKey(web3auth);
    console.log(`publick key: ${publicKey?.toString()}`);

    const userExist = await userExists(userInfo?.email ?? "");
    if (!userExist) {
      console.log('user does not exist, creating user');
      // create user
      const createdPlayer = await createUser({
        clientId: userInfo.email ?? "",
        name: userInfo.name ?? "",
        publicKey: publicKey ?? ""
      });
      console.log('createdPlayer: ', createdPlayer);
    }
      setSessionData({ ...sessionData, clientId: userInfo.email, name: userInfo.name });
      setAuthSessionData({ ...authSessionData, userInfo});
      setWeb3auth(web3authInstance); // Deprecated
  }

  const handleSignIn = async () => {
    if (web3auth !== null) {
      await login();
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

      <img className='topImage'
        src={monkeyTriviaLogo}
        alt='Monkey Trivia Logo'
      />

      <CustomButton
        onClick={handlePlayClick}
      > Sign in to play</CustomButton>
    </div>
  );
};



export default SignInPage;