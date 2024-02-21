import { Flex } from '@mantine/core';
import OptionButton from './OptionButton';
import { useNavigate } from 'react-router-dom';
import { colors } from '../colors';
import useLocalStorageState from 'use-local-storage-state';
import { AuthSessionData } from '../../game-domain/AuthSessionData';
import { mintNft } from '../../solana/MintHandler';
import { SessionData } from '../../screens/SessionData';
import { getSession } from '../../mongo/SessionHandler';
import { getUserFromEmail } from '../../mongo/PlayerHandler';


export const ActionOptionsComponent = () => {
    const navigate = useNavigate();
    const [authSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});
    const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});

    // mint session data as NFT
    const mintSession = async () => {
        // get network from useLocalStorageState

        // if sessionData is not null and sessionId is not null or empty
        if (sessionData === undefined || sessionData?.sessionId === undefined || sessionData?.sessionId === '') {
            return;
        }

        if (!sessionData.clientId) {
            return;
        }

        const currentPlayerId = (await getUserFromEmail(sessionData.clientId))._id;
        const currentGameSession = await getSession(sessionData.sessionId);

        if (!currentPlayerId || !currentGameSession || !authSessionData || !authSessionData.currentUserPublicKey) {
            console.log('mintSessionData: missing data : player id, game session, or public key')
            return;
        }

        console.log('mintSessionData: game session: ', currentGameSession);
        console.log('mintSessionData: authSessionData: ', authSessionData);
        console.log('mintSessionData: current public key: ', authSessionData?.currentUserPublicKey);

        const receipt = await mintNft(
            { 
                playerId: currentPlayerId,
                session: currentGameSession, 
                nftCollectionName: 'alpha1',
                mintToAddress: authSessionData.currentUserPublicKey.toString()
            });

        console.log('mintSessionData: receipt: ', receipt);
    }

    return (
        // Flex component from Mantine
        <Flex
            gap="md"
            justify="center"
            align="center"
            direction="column"
            w="100%"
            h="auto" // Fixed height
        >
            <OptionButton
                fontSize={"20px"}
                onClick={() => {
                    console.log("Minting session data as NFT...")
                    mintSession();
                }}
                background={colors.yellow_gradient}
                color={colors.black}
                style={{
                    marginTop: '0px',
                    marginBottom: '0px',
                }}> Exit and Save
            </OptionButton>

            <OptionButton
                fontSize={"20px"}
                onClick={() => {
                    // Delete game session
                    localStorage.removeItem('sessionData');

                    // Redirect to lobby
                    navigate('/playlobby')
                }}
                background={colors.yellow_gradient}
                color={colors.black}
                style={{
                    marginTop: '0px',
                    marginBottom: '0px',
                }}> Exit Without Saving
            </OptionButton>
        </Flex>

    );
};

export default ActionOptionsComponent;
