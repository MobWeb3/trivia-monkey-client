import React, { useContext } from 'react';
import { Image } from '@mantine/core';
import './SignInPage.css';
import { CustomButton } from '../components/CustomButton';
import { SignerContext } from '../components/SignerContext';
import { useNavigate } from 'react-router-dom';
import monkeyTriviaLogo from '../assets/Screens/signin/monkey-trivia-arched-name-400x200.png';
import mobweb3Logo from '../assets/Screens/signin/monkey-trivia-by-mobweb3-yellowcolorbackground-200x40.png';
import mobweb3LogoM from '../assets/Screens/signin/monkey-trivia-mobweb3-logo-200x200.png';
import { getRPCProviderOwner, getZeroDevSigner } from '@zerodevapp/sdk';
import { getConnectedPublicKey } from '../utils/Web3AuthAuthentication';
import { createUser, userExists } from '../polybase/UserHandler';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from './SessionData';

export const SignInPage = () => {
  const { web3auth, setSigner, setLoggedIn, setUserInfo } = useContext(SignerContext);
  const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData', {});
  const navigate = useNavigate();

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return {};
    }
    await web3auth.connect();
    // setProvider(web3authProvider);
    setLoggedIn(true);

    const userInfo = await web3auth.getUserInfo();
    setUserInfo(userInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    // if (sessionData) {
      setSessionData({ ...sessionData, clientId: userInfo.email, name: userInfo.name });
    // }
    const evmChain = false;

    if (evmChain) {
      const _signer = await getZeroDevSigner({
        projectId: "5682ee04-d8d3-436a-ae63-479e063a23c4",
        owner: getRPCProviderOwner(web3auth.provider),
      })

      setSigner(_signer);
      // console.log("signer created: ", signer);
      console.log("signer address", await _signer.getAddress());
    } else {
      const publicKey = await getConnectedPublicKey(web3auth);
      console.log(`publick key: ${publicKey?.toString()}`);
      console.log(`userInfo: ${JSON.stringify(userInfo)}`);

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

      <Image className='topImage'
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