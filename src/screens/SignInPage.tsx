import React, { useContext } from 'react';
import './SignInPage.css';
import { CustomButton } from '../components/CustomButton';
import { SignerContext } from '../components/SignerContext';
import { useNavigate } from 'react-router-dom';
import monkeyTriviaLogo from '../assets/Screens/signin/monkey-trivia-arched-name-400x200.png';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from './SessionData';
import { AuthSessionData } from '../game-domain/AuthSessionData';
import { login } from '../authentication/Login';

export const SignInPage = () => {
  const { web3auth } = useContext(SignerContext);
  const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
  const [authSessionData, setAuthSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (web3auth !== null) {
      const {userInfo, network} = await login();

      setSessionData({ ...sessionData, clientId: userInfo.email, name: userInfo.name });
      setAuthSessionData({ ...authSessionData, userInfo, currentNetwork: network});
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

// get solana network

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