import './SpinWheel.css';
import { useEffect, useState } from 'react';
import { Container, Flex, Image, Loader } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
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
import { GameSession } from '../game-domain/GameSession';
import { updateInitialTurnPosition, updateSession, sortPlayerList, getNextTurnPlayerId } from '../mongo/SessionHandler';
import useGameSession from '../mongo/useGameSession';

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

    // Check if connected to a session
    useEffect(() => {
        if (!sessionData?.sessionId) {
            setMessage("You are not connected to a session");
        }
    }, [sessionData]);

    useEffect(() => {
        /*
            function to check if we can start game. check that each player has a turn position.
        */
        function canStartGame() {
            const { playerList, numberPlayers } = useGameSessionHook || {};
            if (playerList === undefined || numberPlayers === undefined) return false;
            return playerList?.length >= numberPlayers && playerList.every((player) => player.turn_position > 0);
        }

        // check if we can start the game
        if (sessionData?.sessionId && useGameSessionHook) {
            const { playerList, numberPlayers } = useGameSessionHook;

            if (playerList === undefined || numberPlayers === undefined) return;
                        // console.log('canStartGame', canStartGame);
            if (canStartGame()) {
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

            if (!selectedSlice || !sessionData?.sessionId || !sessionData?.clientId) return;
            // report to our polybase server our turn position.
            await updateInitialTurnPosition({ position: selectedSlice, sessionId: sessionData?.sessionId, playerId: sessionData?.clientId });
        }

        if (hasSpun) {
            handleSelectedSlice();
        }
    }, [hasSpun, selectedSlice, sessionData?.clientId, sessionData?.sessionId]);
    

    useEffect(() => {

        // automatically take to AI game if game phase is GAME_ACTIVE
        if (sessionData?.sessionId && useGameSessionHook) {
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
        if (clientId && channelId && sessionData?.sessionId) {
            setIsLoading(true);
            await sortAndFetchFirstInTurn()
            await updateSession( sessionData?.sessionId, {gamePhase: SessionPhase.GAME_ACTIVE } as GameSession);
            setIsLoading(false);
            navigate('/aigame');
        }
    };

    // setup player list order and current turn player(which is the first player in the list)
    async function sortAndFetchFirstInTurn() {
        if (sessionData?.sessionId === undefined) return;
    
        try {
            await sortPlayerList(sessionData.sessionId);
            await getNextTurnPlayerId(sessionData.sessionId);
        } catch (error) {
            console.error(error);
            // Handle the error appropriately
        }
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
                        (mayStartGame && useGameSessionHook?.hostPlayerId === sessionData?.clientId ) ? (
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