import './ScoreScreen.css'; // This is where you'd import your CSS
import scoreTreeSrc from '../assets/Screens/scoreTree/final-10level-tree-phone-1080x1920.png';
import avatarImgSrc from '../assets/monkeys_avatars/astronaut-monkey1-200x200.png';
import ignoranceImgSrc from '../assets/monkeys_avatars/ignorance-buchon-monkey3-200x200.png';
import { ActionIcon, Container, Flex } from '@mantine/core';
import useGameSession from '../polybase/useGameSession';
import { IGNORANCE_MONKEY_NAME } from '../game-domain/Session';
import { IconHome2 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

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
    // const [, setWindowSize] = useState({
    //     width: window.innerWidth,
    //     height: window.innerHeight,
    // });
    const useGameSessionHook = useGameSession();

    // useEffect(() => {
    //     const handleResize = () => {
    //         setWindowSize({
    //             width: window.innerWidth,
    //             height: window.innerHeight,
    //         });
    //     };

    //     window.addEventListener('resize', handleResize);

    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

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

    return (
        <div className="game-container">
            <Flex>
                <Container bg="linear-gradient(to bottom right, #FDD673, #D5B45B)"
                    className='messageBox'
                >
                    {`${useGameSessionHook.winner} WINS!`}
                </Container>
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
            </Flex>

            {/* <div style={{ display: 'grid'}}> */}
            <img src={scoreTreeSrc} alt="Game background" style={{ width: '100%' }} />
            {
                avatarPositionsData?.map((avatarPositionData) => {
                    const { position, src, id } = avatarPositionData;

                    console.log('avatarPositionData: ', avatarPositionData);
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
            {/* <Flex
                    direction='column'
                    align='center'
                    justify='center'
                    gap="md">

                    <CustomButton fontSize='2rem' style={{

                        // padding: '10px',
                    }}> EXIT WITHOUT MINTING</CustomButton>
                    <CustomButton fontSize='2rem' style={{

                    }}> Mint Session</CustomButton>


                </Flex> */}
            {/* </div> */}
        </div>
    );
};



export default ScoreScreen;
