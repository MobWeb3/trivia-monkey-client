import './SpinWheel.css';
import { useEffect, useRef, useState } from 'react';
import { Button, Loader } from '@mantine/core';
import { addMessageListener, removeMessageListener, sendMessage } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';
import { useNavigate } from 'react-router-dom';
import { publishStartGameAI, subscribeToStartGameAI } from '../ably/AblyMessages';
import { getSession, setCurrentTurnPlayerId, updateInitialTurnPosition, updatePlayerListOrder, updateSessionPhase } from '../polybase/SessionHandler';
import { SessionData } from './SessionData';
import { SessionPhase } from '../game-domain/SessionPhase';
import useLocalStorageState from 'use-local-storage-state';
import wheelImage from './../assets/sprites/wheel2.png'; // replace with your actual image path
import './SpinWheel.css';
import { motion } from 'framer-motion';
import pinImage from './../assets/sprites/pin.png'; // replace with your actual image path
import { Types } from 'ably';
import { ChannelHandler } from '../ably/ChannelHandler';
import Spaces from '@ably/spaces';
import { Realtime } from 'ably';
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";

import AvatarStack from '../components/avatar_stack/AvatarStack';
const VITE_APP_ABLY_API_KEY = import.meta.env.VITE_APP_ABLY_API_KEY ?? "";

function SpinWheel() {

    const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const [mayStartGame, setMayStartGame] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Add this line

    const [canSpin, setCanSpin] = useState(true);
    const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
    const [message, setMessage] = useState("Message");
    const [rotationDegrees, setRotationDegrees] = useState(0);
    const channel = useRef<Types.RealtimeChannelPromise | null>(null);
    // const [space, setSpace] = useLocalStorageState<Space>('spaces', {});
    const [hasSpun, setHasSpun] = useState(false);

    const clientRef = useRef<Types.RealtimePromise | null>(null);
    const spacesRef = useRef<Spaces | null>(null);



    const slices = 12;
    const sliceValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const navigate = useNavigate();
    useEffect(() => {
        initializeChannel();

        // Cleanup function
        return () => {
            // Code to clean up the channel
        };
    });

    useEffect(() => {
        const getSpace = async () => {
            if (!clientRef.current) {
                clientRef.current = new Realtime.Promise({ key: VITE_APP_ABLY_API_KEY, clientId: sessionData?.clientId });
            }

            if (!spacesRef.current) {
                spacesRef.current = new Spaces(clientRef.current);
            }

            
            // const space = await spacesRef.current.get(sessionData?.channelId as string)
            // setSpace(space);
            // space.enter({
            //     username: sessionData?.clientId,
            //     avatar: avatarImage,
            // });
            // space.subscribe('update', (spaceState) => {
            //     console.log("space members:", spaceState.members);
            // });
        }
        if (sessionData?.sessionId && sessionData?.clientId) {
            getSpace();
        }

    }, [sessionData?.sessionId, sessionData?.clientId, sessionData?.channelId]);

    useEffect(() => {
        const handleSelectedSlice = async () => {
            console.log('handleSelectedSlice has run');
            setCanSpin(false);
            setMessage(selectedSlice?.toString() ?? "");
            // Here you can add your logic to update the turn position and publish the 'turn-selected' event

            // report to our polybase server our turn position.
            await updateInitialTurnPosition({ initialTurnPosition: selectedSlice, id: sessionData?.sessionId, clientId: sessionData?.clientId });

            // report through ably that we are done choosing our turn.
            await channel.current?.publish('turn-selected', { turn: selectedSlice });
        }

        if (hasSpun) {
            handleSelectedSlice();
        }
    }, [hasSpun, selectedSlice, sessionData?.clientId, sessionData?.sessionId]);

    useEffect(() => {
        console.log('sessionData', sessionData);

        const enableStartGameButton = () => {
            console.log('enableStartGameButton');
            setMayStartGame(true);
        };

        addMessageListener(Messages.MAY_START_GAME, enableStartGameButton);

        console.log('SpinWheel useEffect');

        if (sessionData && sessionData.clientId && sessionData.channelId) {
            const { clientId, channelId } = sessionData;
            subscribeToStartGameAI(clientId, channelId);
        }

        const handleOpenAIGame = async (event: any) => {
            // update order list        
            //make call to polybase to set the first in turn
            setIsLoading(true);
            if (sessionData) {
                const playerList = (await updatePlayerListOrder({ id: sessionData.sessionId })).playerList;
                console.log('playerList', playerList);
                // set the first player in the list as the current turn player
                await setCurrentTurnPlayerId({ id: sessionData.sessionId, playerId: playerList[0] })
                // if all players have selected their turn, then we can proceed to the next phase.
                await updateSessionPhase({ id: sessionData.sessionId, newPhase: SessionPhase.GAME_ACTIVE });
            }
            setIsLoading(false);
            console.log('Naviagting to Game', event.detail);
            navigate('/aigame');
        };

        window.addEventListener(Messages.START_GAME_AI, handleOpenAIGame);

        // Cleanup listener when component unmounts
        return () => {
            window.removeEventListener(Messages.START_GAME_AI, handleOpenAIGame);
            removeMessageListener(Messages.MAY_START_GAME, enableStartGameButton);
        };
    }, [sessionData, navigate]);

    const handleStartGame = () => {
        console.log('handleStartGame');
        console.log('handleStartGame SpinWheel sesionData: ', sessionData);
        if (sessionData === null) return;
        const { clientId, channelId } = sessionData as SessionData;
        if (clientId && channelId) {
            navigate('/aigame');
            publishStartGameAI(clientId, channelId)
        }
    };

    const spin = async () => {
        if (canSpin) {
            setMessage("");
            const minRounds = 2;
            const maxRounds = 4;
            const rounds = Math.floor(Math.random() * (maxRounds - minRounds + 1)) + minRounds;
            const fullCircleDegrees = 360;
            const sliceDegree = fullCircleDegrees / slices;
            const randomOffset = Math.random() * sliceDegree; // random offset within a slice

            const degrees = ((Math.floor(Math.random() * slices) * sliceDegree) + rotationDegrees + randomOffset) % fullCircleDegrees;
            setSelectedSlice(sliceValues[slices - 1 - Math.floor(degrees / sliceDegree)]);
            setCanSpin(false);

            // Calculate total degrees to rotate
            const totalDegrees = rotationDegrees + rounds * fullCircleDegrees + degrees;
            setRotationDegrees(totalDegrees);

            // Wait for spinning animation to complete
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Adjust the duration as needed

            // Call handleSelectedSlice after spinning is complete
            setHasSpun(true);
        }
    }



    const initializeChannel = async () => {
        console.log('sessionData in initializeChannel', sessionData);
        if (sessionData?.channelId && sessionData?.clientId) {
            const session = await getSession({ id: sessionData?.sessionId });
            const channelHandler = await ChannelHandler.getInstance().initChannelHandler(sessionData?.clientId);
            await channelHandler?.enterChannel({ channelId: sessionData?.channelId, clientId: sessionData?.clientId, nickname: "" });
            channel.current = ChannelHandler.ablyInstance?.ablyInstance.channels.get(sessionData?.channelId) as Types.RealtimeChannelPromise;
            // console.log('HERE channelId: ', this.channelId);
            // console.log('HERE channel: ', this.channel);
            if (session.hostPlayerId === sessionData?.clientId) {
                console.log("subscribing to turn-selected");
                channel.current?.subscribe('turn-selected', async (message) => {
                    console.log('turn selected by: ', message.clientId);
                    const { initialTurnPosition, numberPlayers } = await getSession({ id: sessionData.sessionId });

                    console.log('initialTurnPositions: ', initialTurnPosition);
                    console.log('numberPlayers: ', numberPlayers);

                    const initialTurnPositionLength = Object.keys(initialTurnPosition).length;
                    const canStartGame = initialTurnPositionLength >= numberPlayers;

                    // console.log('canStartGame: ', canStartGame);
                    // check if all other players have already selected their turn. To do this we must check the length of 
                    // initialTurnPosition in the Polybase server
                    if (canStartGame) {
                        // console.log('GAME_ACTIVE!');
                        sendMessage(Messages.MAY_START_GAME, { sessionId: sessionData.sessionId });
                    }
                });
            }

        }
    }

    function getSpaces() {
        if (spacesRef.current !== null) {
            const spaces: Spaces = spacesRef.current;
            return spaces;
        }
        return new Spaces(new Realtime.Promise({ key: VITE_APP_ABLY_API_KEY, clientId: sessionData?.clientId }))
    }

    return (
        <div>
            <SpacesProvider client={getSpaces()}>
                <SpaceProvider name="avatar-stack">
                    <AvatarStack />
                </SpaceProvider>
            </SpacesProvider>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                {isLoading ? <Loader /> :
                    mayStartGame ? (
                        <Button
                            style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)' }}
                            loading={false}
                            variant="gradient"
                            gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                            onClick={handleStartGame}
                        >
                            Start Game
                        </Button>) : null
                }
                <p style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', color: 'black', fontWeight: 'bold' }}>{message}</p>
                <motion.div
                    onClick={spin}
                    animate={{ rotate: `${rotationDegrees}deg` }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    style={{ transformOrigin: "center", display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                    <img src={wheelImage} alt="Wheel" style={{ objectFit: "contain" }} />
                </motion.div>
                <img src={pinImage} alt="Pin" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            </div>
        </div>

    );
}

export default SpinWheel;