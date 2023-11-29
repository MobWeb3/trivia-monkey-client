// import { useState } from 'react';
import './ScoreScreen.css'; // This is where you'd import your CSS
import scoreTreeSrc from '../assets/Screens/scoreTree/final-10level-tree-phone-1080x1920.png';
import avatarImgSrc from '../assets/monkeys_avatars/astronaut-monkey1-200x200.png';
import { Container } from '@mantine/core';
import useGameSession from '../polybase/useGameSession';

type AvatarPosition = {
    top: number;
    left: number;
}

const ScoreScreen = () => {
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
        let result: AvatarPosition[] = [];


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
              };
              
              if (positions.hasOwnProperty(gameBoardState[key])) {
                result.push(positions[gameBoardState[key]]);
              }
        });
    
        
    
        // This function would calculate the positions of your avatars based on the screen size
        // For example, it might return something like:
        return result;
    };

    const avatarPositions = calculatePositions();

    return (
        <div className="game-container">
            <Container bg="linear-gradient(to bottom right, #FDD673, #D5B45B)"
                className='messageBox'
            >
                {`${useGameSessionHook.winner} WINS!`}
            </Container>
            <img src={scoreTreeSrc} alt="Game background" style={{ width: '100%' }} />
            {avatarPositions?.map((pos, index) => (
                <img
                    key={index}
                    src={avatarImgSrc}
                    className="avatar"
                    style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                    alt="Avatar"

                />
            ))}
        </div>
    );
};



export default ScoreScreen;
