import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SignerContext, SignerProvider } from './components/SignerContext';
import SignInPage from './screens/SignInPage';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import PlayLobby from './screens/PlayLobby';
import CreateGame from './screens/CreateGame';
import JoinGame from './screens/JoinGame';
import SpinWheel from './screens/SpinWheel';
import { SessionDataProvider } from './components/SessionDataContext';
import AIGame from './screens/AIGame';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { TopicProvider } from './components/topics/TopicContext';
import { theme } from './theme';
import ScoreScreen from './screens/ScoreScreen';
import { WagmiConfig } from 'wagmi';
import { getWagmiConfig } from './evm/WagmiConnector';
import { Profile } from './screens/Profile';
import NftWalletScreen from './screens/NftWalletScreen';
import { MoonPayProvider } from '@moonpay/moonpay-react';
import FrameInitialScreen from './frames/FrameInitialScreen';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
  <SignerProvider>
    <MoonPayProvider
      apiKey="pk_test_Wm3SEXm9umlBq6IUD5vmCSek2X1i9w"
      debug={true}
    >
      <AppComponent />
    </MoonPayProvider>
  </SignerProvider>
);

const NavigationHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const channelId = params.get('channelId');
    const sessionId = params.get('sessionId');
    if (page === 'join') {
      navigate(`/joingame?channelId=${channelId}&sessionId=${sessionId}`);
    }
  }, [location.search, navigate]);

  return null;
};

function AppComponent() {

  const { web3auth } = useContext(SignerContext);

  return (
    <React.StrictMode>
      <SessionDataProvider>
        <MantineProvider theme={theme}>
          <TopicProvider>
            <WagmiConfig config={getWagmiConfig(web3auth)}>
              <Router>
                <NavigationHandler />
                <Routes>
                  <Route path="/playlobby" element={<PlayLobby />} />
                  <Route path="*" element={<SignInPage />} />
                  <Route path="/creategame" element={<CreateGame />} />
                  <Route path="/joingame" element={<JoinGame />} />
                  <Route path="/spinwheel" element={<SpinWheel />} />
                  <Route path="/aigame" element={<AIGame />} />
                  <Route path="/scoretree" element={<ScoreScreen />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wallet" element={<NftWalletScreen />} />
                  <Route path="/frames" element={<FrameInitialScreen />} />
                  {/* other routes... */}
                </Routes>
                {/* <Bootstrap /> */}
              </Router>
            </WagmiConfig>
          </TopicProvider>
        </MantineProvider>
      </SessionDataProvider>
    </React.StrictMode>
  )
}
