import './ScoreScreen.css'; // This is where you'd import your CSS
import scoreTreeSrc from '../assets/Screens/scoreTree/final-10level-tree-phone-1080x1920.png';
import avatarImgSrc from '../assets/monkeys_avatars/astronaut-monkey1-200x200.png';
import ignoranceImgSrc from '../assets/monkeys_avatars/ignorance-buchon-monkey3-200x200.png';
import { ActionIcon, Container, Grid, SimpleGrid } from '@mantine/core';
import useGameSession from '../polybase/useGameSession';
import { IGNORANCE_MONKEY_NAME } from '../game-domain/Session';
import { IconHome2 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ActionButton } from '../components/nft_wallet/ActionButton';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from './SessionData';
import { MutableNftGameSession } from '../game-domain/ nfts/NftGameSession';
import { getWeb3AuthSigner } from '../evm/Login';
import { getProvider } from '../evm/alchemy/Web3AuthSigner';
import { crossChainMintNftComplete } from '../evm/user-operation/mint';

type AvatarPosition = {
    top: number;
    left: number;
}

type AvatarPositionData = {
    position: AvatarPosition;
    level: number;
    src: string;
    id: string;
}

const ScoreScreen = () => {
    const navigate = useNavigate();
    const useGameSessionHook = useGameSession();
    const [sessionData] = useLocalStorageState<SessionData>('sessionData');
    // const { web3auth } = useContext(SignerContext);

    const calculatePositions = () => {
        let result: AvatarPositionData[] = [];
        if (!useGameSessionHook || !useGameSessionHook.gameBoardState) return [];

        const { gameBoardState } = useGameSessionHook;
        // gameBoardState[0] = 10;
        // gameBoardState[11] = 9;
        // gameBoardState[1] = 8;
        // gameBoardState[2] = 7;
        // gameBoardState[3] = 6;
        // gameBoardState[4] = 5;
        // gameBoardState[5] = 4;
        // gameBoardState[6] = 3;
        // gameBoardState[7] = 2;
        // gameBoardState[8] = 1;

        Object.keys(gameBoardState).forEach((key) => {
            // console.log('key: ', key);
            // console.log('value: ', gameBoardState[key]);

            const positions: { [key: number]: { top: number, left: number } } = {
                10: { top: 12, left: 50 }, // if adding more players, add width of avatar to right
                9: { top: 20, left: 55 }, // add to to the left for more players
                8: { top: 25, left: 70 }, // add to to the left for more players
                7: { top: 30, left: 27 }, // add to to the left for more players
                6: { top: 45, left: 80 }, // 20 + add to the left for more players
                5: { top: 55, left: 35 },
                4: { top: 61, left: 60 },
                3: { top: 72, left: 70 },
                2: { top: 75, left: 33 },
                1: { top: 82, left: 48 },
                0: { top: 82, left: 48 }
            };

            if (positions.hasOwnProperty(gameBoardState[key])) {
                // result.push(positions[gameBoardState[key]]);
                result.push(
                    { position: positions[gameBoardState[key]], src: avatarImgSrc, id: key, level: gameBoardState[key] }
                );
            }
        });

        // This function would calculate the positions of your avatars based on the screen size
        // For example, it might return something like:
        return result;
    };

    const avatarPositionsData = calculatePositions();

    function getOrdinalSuffix(n: number) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    /**
     * Generate NFT data from the GameSession (useGameSessionHook)
     */
    const generateCompleteNftData = () => {
        // const session = useGameSessionHook;

        const gameBoardState = useGameSessionHook?.gameBoardState;

        if (gameBoardState === undefined || !sessionData?.clientId) {
            return null;
        }

        const place = getOrdinalSuffix(gameBoardState[sessionData?.clientId] ?? 1);

        const nftData = {
            name: `Monkey Trivia ${place} place`,
            description: 'Game session completed.  You are a winner!',
            image: 'https://bafybeiexxy7vptptj6yx6rehv5xp4ga7zztbe2udu2d3ga3be4gsn7nkx4.ipfs.nftstorage.link/',
            attributes: [
                {
                    trait_type: 'timestamp',
                    value: Date.now()
                },
                {
                    trait_type: 'place',
                    value: place
                },
                {
                    trait_type: 'sessionId',
                    value: useGameSessionHook?.sessionId
                }
            ]
        } as MutableNftGameSession;
        return nftData;
    };

    /**
     * Function to convert Json to URI using base64 encoding
     */
    const jsonToURI = (json: any) => {
        return `data:application/json;base64,${btoa(JSON.stringify(json))}`;
    };

    return (
        <div className="game-container">
            <Grid m={'xs'}>
                <Grid.Col span={10}>
                    <Container fluid bg="#FDD673" className='messageBox'>
                        {`${useGameSessionHook?.winner} WINS!`}
                    </Container>
                </Grid.Col>
                <Grid.Col span={2} >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}>
                        <ActionIcon
                            variant="gradient"
                            size="xl"
                            aria-label="Gradient action icon"
                            gradient={{ from: 'purple', to: 'cyan', deg: 90 }}
                            onClick={() => {
                                navigate('/playlobby');
                                localStorage.removeItem('sessionData');
                            }}
                        >
                            <IconHome2 />
                        </ActionIcon>
                    </div>
                </Grid.Col>
            </Grid>

            <img src={scoreTreeSrc} alt="Game background" style={{
                width: '100%',
                borderRadius: '30px',
            }} />
            {
                avatarPositionsData?.map((avatarPositionData) => {
                    const { position, src, id } = avatarPositionData;

                    // console.log('avatarPositionData: ', avatarPositionData);
                    return (
                        <img
                            key={id}
                            src={id === IGNORANCE_MONKEY_NAME ? ignoranceImgSrc : src}
                            className="avatar"
                            style={{ top: `${position.top}%`, left: `${position.left}%` }}
                            alt="Avatar"

                        />
                    );
                })
            }
            <SimpleGrid cols={1} verticalSpacing="xs">
                <ActionButton
                    text={"Mint Session"}
                    onClick={async () => {
                        const nftData = generateCompleteNftData();
                        const base64Url = jsonToURI(nftData);

                        // console.log('nftData: ', nftData);
                        // console.log('baase64Url: ', base64Url);
                        const web3authSigner = await getWeb3AuthSigner();
                        const provider = getProvider(web3authSigner);

                        await crossChainMintNftComplete(provider, base64Url);
                    }}
                />
                {/* <ActionButton text={"Exit"}/> */}
            </SimpleGrid>

        </div>
    );
};

export default ScoreScreen;
