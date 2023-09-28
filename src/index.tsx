import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as serviceWorkerRegistration from './shenanigans/serviceWorkerRegistration';
import reportWebVitals from './shenanigans/reportWebVitals';
import { SignerProvider } from './components/SignerContext';
import Bootstrap from './sceneReactComponents/Bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PlayLobby from './sceneReactComponents/PlayLobby';
import CreateGame from './sceneReactComponents/CreateGame';
import { ConnectionStatus } from './components/ConnectionStatus';
import JoinGame from './sceneReactComponents/JoinGame';
import SpinWheel from './sceneReactComponents/SpinWheel';
import { SessionDataProvider } from './components/SessionDataContext';
import AIGame from './sceneReactComponents/AIGame';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    
      <SignerProvider>
        <SessionDataProvider>
        <MantineProvider>
          <Router>
            <ConnectionStatus image={''} name={''} email={'connecgted'} />
            <Routes>
              <Route path="/playlobby" element={<PlayLobby />} />
              <Route path="*" element={<Bootstrap />} />
              <Route path="/creategame" element={<CreateGame />} />
              <Route path="/joingame" element={<JoinGame />} />
              <Route path="/spinwheel" element={<SpinWheel />} />
              <Route path="/aigame" element={<AIGame />} />
              {/* other routes... */}
            </Routes>
            {/* <Bootstrap /> */}
          </Router>
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
