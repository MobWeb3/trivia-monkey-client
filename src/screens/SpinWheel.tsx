import './SpinWheel.css';
import { useEffect, useState } from 'react';
import { Container, Flex, Image, Loader } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { setCurrentTurnPlayerId, updateInitialTurnPosition, updatePlayerListOrder, updateSessionPhase } from '../polybase/SessionHandler';
import { SessionData } from './SessionData';
import { SessionPhase } from '../game-domain/SessionPhase';
import useLocalStorageState from 'use-local-storage-state';
import wheelImage from './../assets/sprites/wheel2.png'; // replace with your actual image path
import './SpinWheel.css';
import { motion } from 'framer-motion';
import pinImage from './../assets/sprites/pin.png'; // replace with your actual image path
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import AvatarStack from '../components/avatar_stack/AvatarStack';
import CustomButton from '../components/CustomButton';
import { getSpacesInstance } from '../ably/SpacesSingleton';
import useGameSession from '../polybase/useGameSession';

function SpinWheel() {

    const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const [mayStartGame, setMayStartGame] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Add this line
    const [canSpin, setCanSpin] = useState(true);
    const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
    const [message, setMessage] = useState("Click to spin!");
    const [rotationDegrees, setRotationDegrees] = useState(0);
    const [hasSpun, setHasSpun] = useState(false);
    const slices = 12;
    const sliceValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const navigate = useNavigate();
    const useGameSessionHook = useGameSession();

    useEffect(() => {
        // console.log('useEffect sessionData', sessionData);

        // check if we can start the game
        if (sessionData?.sessionId) {
            const { initialTurnPosition, numberPlayers } = useGameSessionHook;

            if (initialTurnPosition === undefined || numberPlayers === undefined) return;

            // console.log('initialTurnPosition', initialTurnPosition);
            // console.log('numberPlayers', numberPlayers);
            const initialTurnPositionLength = Object.keys(initialTurnPosition).length;
            const canStartGame = initialTurnPositionLength >= numberPlayers;
            // console.log('canStartGame', canStartGame);
            if (canStartGame) {
                // console.log('GAME_ACTIVE!');
                setMayStartGame(true);
            }
        }

        // console.log('useGameSessionHook', useGameSessionHook);
    },[sessionData, sessionData?.sessionId, useGameSessionHook]);

    useEffect(() => {
        const handleSelectedSlice = async () => {
            // console.log('handleSelectedSlice has run');
            setCanSpin(false);
            setMessage(selectedSlice?.toString() ?? "");
            // Here you can add your logic to update the turn position and publish the 'turn-selected' event

            // report to our polybase server our turn position.
            await updateInitialTurnPosition({ initialTurnPosition: selectedSlice, id: sessionData?.sessionId, clientId: sessionData?.clientId });
        }

        if (hasSpun) {
            handleSelectedSlice();
        }
    }, [hasSpun, selectedSlice, sessionData?.clientId, sessionData?.sessionId]);
    

    useEffect(() => {

        // automatically take to AI game if game phase is GAME_ACTIVE
        if (sessionData?.sessionId) {
            const { gamePhase } = useGameSessionHook;

            if (gamePhase === SessionPhase.GAME_ACTIVE) {
                navigate('/aigame');
            }
        }

    }, [sessionData, navigate, useGameSessionHook]);

    const handleStartGame = async () => {
        // console.log('handleStartGame');
        // console.log('handleStartGame SpinWheel sesionData: ', sessionData);
        if (sessionData === null) return;
        const { clientId, channelId } = sessionData as SessionData;
        if (clientId && channelId) {
            setIsLoading(true);
            await updatePlayerAndTurn()

            // Upldate polybase session phase to GAME_ACTIVE
            await updateSessionPhase({ id: sessionData?.sessionId, newPhase: SessionPhase.GAME_ACTIVE });
            setIsLoading(false);
            navigate('/aigame');
        }
    };

    // setup player list order and current turn player(which is the first player in the list)
    async function updatePlayerAndTurn() {
        const playerList = (await updatePlayerListOrder({ id: sessionData?.sessionId })).playerList;
        // set the first player in the list as the current turn player
        await setCurrentTurnPlayerId({ id: sessionData?.sessionId, playerId: playerList[0] })
    }

    const spin = async () => {
        if (canSpin) {
            setMessage("Spinning...");
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

    function getSpaces() {
        return getSpacesInstance(sessionData?.clientId ?? "");
    }

    return (
        <div className='SpinWheelPage'>
            <Flex
                direction='column'
                align='center'
                justify='center'
                gap="sm"
            >
                <div className='topAvatarStacks'>
                    <SpacesProvider client={getSpaces()}>
                        <SpaceProvider name="avatar-stack">
                            <AvatarStack />
                        </SpaceProvider>
                    </SpacesProvider>
                </div>

                <Container bg="#FDD673"
                    className='chooseTurnTitle'
                >
                    {message}
                </Container>

                <Container style={{
                    position: 'relative',
                    marginBottom: '10%',
                    marginTop: '10%',

                }}>
                    <motion.div
                        animate={{ rotate: `${rotationDegrees}deg` }}
                        transition={{ duration: 3, ease: "easeOut" }}
                        style={{
                            width: '100%',
                        }}
                    >
                        <Image
                            src={wheelImage}
                            fit="contain"

                        />
                    </motion.div>
                    <img src={pinImage} 
                        alt="Pin"
                        onClick={spin}
                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                </Container>

                <Container style={{
                    position: 'relative'
                }}>
                    {isLoading ? <Loader /> :
                        // check if we can start the game annd if we are the host to display the start game button
                        (mayStartGame && useGameSessionHook.hostPlayerId === sessionData?.clientId ) ? (
                            <CustomButton
                                fontSize='1.5rem'
                                onClick={handleStartGame}
                            >
                                Start Game
                            </CustomButton>) : null
                    }
                </Container>

            </Flex>
        </div>
    );
}

export default SpinWheel;