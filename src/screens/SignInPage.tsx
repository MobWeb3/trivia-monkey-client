import React, { useContext } from 'react';
import './SignInPage.css';
import { CustomButton } from '../components/CustomButton';
import { SignerContext } from '../components/SignerContext';
import { useNavigate } from 'react-router-dom';
import monkeyTriviaLogo from '../assets/Screens/signin/monkey-trivia-arched-name-400x200.png';
import { getConnectedPublicKey } from '../utils/Web3AuthAuthentication';
import { createUser, userExists } from '../polybase/UserHandler';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from './SessionData';
import { getWeb3AuthSigner } from '../evm/Login';

export const SignInPage = () => {
  const { web3auth, setWeb3auth, setLoggedIn, setUserInfo } = useContext(SignerContext);
  const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
  const navigate = useNavigate();

  const login = async () => {

    const isEvmChain = import.meta.env.VITE_APP_EVM_CHAIN === 'true';

    if (isEvmChain) {
      const web3authSigner = await getWeb3AuthSigner();
      setWeb3auth(web3authSigner.inner);
    } else {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return {};
      }
      await web3auth.connect();
      setLoggedIn(true);

      const userInfo = await web3auth.getUserInfo();
      const publicKey = await getConnectedPublicKey(web3auth);
      console.log(`publick key: ${publicKey?.toString()}`);
      // console.log(`userInfo: ${JSON.stringify(userInfo)}`);

      setUserInfo(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setSessionData({ ...sessionData, clientId: userInfo.email, name: userInfo.name });

      const userExist = await userExists(userInfo?.email ?? "");
      if (!userExist) {
        console.log('user does not exist, creating user');
        // create user
        await createUser({
          clientId: userInfo.email ?? "",
          name: userInfo.name ?? "",
          publicKey: publicKey ?? ""
        });
      }
    }
  };

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