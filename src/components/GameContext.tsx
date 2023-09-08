// import React from 'react';

// // Create a context with a default undefined value
// export const GameContext = React.createContext(undefined);

// // Create a provider component
// export function GameProvider({ children }) {
//   const [game, setGame] = React.useState(undefined);

//   useEffect(() => {
//     const gameInstance = GameInstance.startScene('SpinWheelScene', {
//       sessionId: "mk-pbid-c932da83-18cd-41db-892d-2fe5ce1990a2",
//       clientId: "norman.lopez.krypto@gmail.com",
//       channelId: "tm-chid-9b1d0a09-8ad0-4895-a92b-3293c572ad79",
//     });
//     setGame(gameInstance);
//   }, []);

//   return (
//     <GameContext.Provider value={game}>
//       {children}
//     </GameContext.Provider>
//   );
// }

// import React, { createContext, useState } from 'react';
// import { SessionData } from '../sceneReactComponents/SessionData';
// import { Game } from 'phaser';

// interface SessionDataType {
//   game:  | null;
//   setSessionData: (sessionData: SessionData) => void;
// }

// export const SessionDataContext = createContext<SessionDataType>({
//   sessionData: null,
//   setSessionData: () => { },
// });

// interface Props {
//   children: React.ReactNode;
// }

// export const SessionDataProvider: React.FC<Props> = ({ children }) => {
//   const [sessionData, setSessionData] = useState<any>(null);

//   return (
//     <SessionDataContext.Provider value={{ sessionData, setSessionData }}>
//       {children}
//     </SessionDataContext.Provider>
//   );
// };