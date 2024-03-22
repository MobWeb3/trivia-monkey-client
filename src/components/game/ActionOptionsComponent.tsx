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
import { getUSDCBalance } from '../../solana/helpers';

export interface ActionOptionsComponentProps {
    setShowBuyCredits?: (show: boolean) => void;
}

export const ActionOptionsComponent: React.FC<ActionOptionsComponentProps> = ({setShowBuyCredits}) => {
    const navigate = useNavigate();
    const [authSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});
    const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});
    

    // mint session data as NFT
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                onClick={async () => {
                    console.log("Minting session data as NFT...")

                    if (!authSessionData?.currentUserPublicKey) {
                        console.log('mintSessionData: missing public key')
                        return;
                    }

                    // // Let's check the balance before minting. For solana is about 0.02 SOL
                    // await getSolanaBalance(authSessionData?.currentUserPublicKey);

                    const balance = await getUSDCBalance(authSessionData?.currentUserPublicKey);
                    
                    if (balance && balance < 12.00) {
                        console.info('mintSessionData: insufficient balance')
                        setShowBuyCredits && setShowBuyCredits(true);
                        return;
                    }

                    // mintSession(); //TODO: uncomment this line. testing payment for now.
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
