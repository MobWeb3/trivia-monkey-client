import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SignerContext, SignerProvider } from './components/SignerContext';
import SignInPage from './screens/SignInPage';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
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

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
  <SignerProvider>
    <AppComponent />
  </SignerProvider>
);

function AppComponent() {

  const { web3auth} = useContext(SignerContext);

  return (
    <React.StrictMode>
        <SessionDataProvider>
          <MantineProvider theme={theme}>
            <TopicProvider>
              <WagmiConfig config={getWagmiConfig(web3auth)}>
                <Router>
                  <Routes>
                    <Route path="/playlobby" element={<PlayLobby />} />
                    <Route path="*" element={<SignInPage />} />
                    <Route path="/creategame" element={<CreateGame />} />
                    <Route path="/joingame" element={<JoinGame />} />
                    <Route path="/spinwheel" element={<SpinWheel />} />
                    <Route path="/aigame" element={<AIGame />} />
                    <Route path="/scoretree" element={<ScoreScreen />} />
                    <Route path="/profile" element={<Profile />} />
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
