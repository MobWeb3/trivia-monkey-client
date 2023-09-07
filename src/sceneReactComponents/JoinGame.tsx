import { useContext, useEffect, useState } from 'react';
import { enterChannelListenerWrapper } from '../ably/ChannelListener';
import { SignerContext } from '../components/SignerContext';
import { Messages } from '../utils/Messages';
import { useNavigate } from 'react-router-dom';
import { SessionDataContext } from '../components/SessionDataContext';

const JoinGame = () => {
    const [channelId, setChannelId] = useState('');
    const { web3auth } = useContext(SignerContext);
    const navigate = useNavigate(); 
    const { setSessionData } = useContext(SessionDataContext);


    useEffect(() => {
        const handleAllPlayersJoined = (event:any) => {
            console.log('All players have joined', event.detail);
            setSessionData(event.detail);
            // Handle the event here
            navigate('/spinwheel');
        };

        window.addEventListener(Messages.ALL_PLAYERS_JOINED, handleAllPlayersJoined);

        // Cleanup listener when component unmounts
        return () => {
            window.removeEventListener(Messages.ALL_PLAYERS_JOINED, handleAllPlayersJoined);
        };
    }, []);

    const handleJoinGame = async (data: any) => {
        if (web3auth) {
            await enterChannelListenerWrapper(web3auth, data);
        }
    };

    const handleJoinButtonClick = () => {
        if (channelId !== '' ) {
            handleJoinGame({ channelId });
        }
    };

    return (
        <div>
            <h1>Please id to join</h1>
            <input type="text" placeholder="Channel id" value={channelId} onChange={e => setChannelId(e.target.value)} />
            <button name="playButton" onClick={handleJoinButtonClick}>Join</button>
        </div>
    );
};

export default JoinGame;