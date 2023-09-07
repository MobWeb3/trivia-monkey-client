import { useContext, useState } from 'react';
import { createChannelListenerWrapper } from '../ably/ChannelListener';
import { SignerContext } from '../components/SignerContext';

const CreateGame = () => {
    const [nickname, setNickname] = useState('');
    const [numberPlayers, setNumberPlayers] = useState('');
    const [pointsToWin, setPointsToWin] = useState('');
    const { web3auth } = useContext(SignerContext);

    const handleCreateChannel = async (data: any) => {
        if (web3auth) {
            await createChannelListenerWrapper(web3auth, data);
        }
    };

    const handlePlayButtonClick = () => {
        if (nickname !== '' && numberPlayers !== '' && pointsToWin !== '') {
            handleCreateChannel({ nickname, numberPlayers, pointsToWin });
        }
    };

    return (
        <div>
            <h1>Please enter your name</h1>
            <input type="text" placeholder="Enter nickname" value={nickname} onChange={e => setNickname(e.target.value)} />
            <input type="text" placeholder="Enter number of players" value={numberPlayers} onChange={e => setNumberPlayers(e.target.value)} />
            <input type="text" placeholder="Enter points to win" value={pointsToWin} onChange={e => setPointsToWin(e.target.value)} />
            <button name="playButton" onClick={handlePlayButtonClick}>Play</button>
            <p>Welcome {nickname}! Number of players: {numberPlayers}</p>
        </div>
    );
};

export default CreateGame;