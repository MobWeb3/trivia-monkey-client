import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SignerProvider } from './components/SignerContext';
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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>

    <SignerProvider>
      <SessionDataProvider>
        <MantineProvider>
          <TopicProvider>
            <Router>
              <Routes>
                <Route path="/playlobby" element={<PlayLobby />} />
                <Route path="*" element={<SignInPage />} />
                <Route path="/creategame" element={<CreateGame />} />
                <Route path="/joingame" element={<JoinGame />} />
                <Route path="/spinwheel" element={<SpinWheel />} />
                <Route path="/aigame" element={<AIGame />} />
                {/* other routes... */}
              </Routes>
              {/* <Bootstrap /> */}
            </Router>
          </TopicProvider>
        </MantineProvider>
      </SessionDataProvider>
    </SignerProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
