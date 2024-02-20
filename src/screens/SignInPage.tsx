import { useState } from 'react';
import './SignInPage.css';
import { CustomButton } from '../components/CustomButton';
import monkeyTriviaLogo from '../assets/Screens/signin/monkey-trivia-arched-name-400x200.png';
import PickUserLevelCard from '../components/sign_in/PickUserLevelCard';
import { Transition } from '@mantine/core';

export const SignInPage = () => {

  // const [showPickLevelCard, setShowPickLevelCard] = useState(true);
  const [signInPressed, setSignInPressed] = useState(false);

  const advanceToLevelPick = async () => {
    // if (web3auth !== null) {
    //   const { userInfo, network } = await login();

    //   setSessionData({ ...sessionData, clientId: userInfo.email, name: userInfo.name });
    //   setAuthSessionData({ ...authSessionData, userInfo, currentNetwork: network });
    // }
    // navigate('/playlobby');
    setSignInPressed(true);
  }

  return (
    <div className='signInPage'>

      <img className='topImage'
        src={monkeyTriviaLogo}
        alt='Monkey Trivia Logo'
      />

      {!signInPressed ? <CustomButton
        onClick={advanceToLevelPick}
      > Sign in to play</CustomButton> : null}

      {signInPressed ? <Transition
        mounted={signInPressed}
        transition="fade"
        duration={2000}
      >
        {(styles) => <PickUserLevelCard showCard={signInPressed} styles={styles} />}
      </Transition> : null}
    </div>
  );
}

export default SignInPage;