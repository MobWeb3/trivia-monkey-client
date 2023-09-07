import React, { useState } from 'react';
import { sendMessage } from "../utils/MessageListener";
import { Messages } from "../utils/Messages";

const CreateGame = () => {
    const [nickname, setNickname] = useState('');
    const [numberPlayers, setNumberPlayers] = useState('');
    const [pointsToWin, setPointsToWin] = useState('');

    const handlePlayButtonClick = () => {
        if (nickname !== '') {
            sendMessage(Messages.CREATE_CHANNEL, {
                "nickname": nickname,
                "numberPlayers": numberPlayers,
                "pointsToWin": pointsToWin
            });
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