import { useContext, useEffect } from 'react'
import { SignerContext } from '../components/SignerContext'
import { useNavigate } from 'react-router-dom'
import { UserCardImage } from '../components/profile/UserCardImage';
import useLocalStorageState from 'use-local-storage-state';
import { AuthSessionData } from '../game-domain/AuthSessionData';
import { isEvmChain } from '../authentication/NetworkDetector';
import { ProfileEvm } from '../components/profile/evm/ProfileEvm';
import { isSolanaNetwork } from '../solana/helpers';

export function Profile() {
    const { web3auth, setWeb3auth } = useContext(SignerContext);
    const navigate = useNavigate();

    const [authSessionData, setAuthSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});


    return (
        <div>
            <UserCardImage userInfo={authSessionData?.userInfo} />
            {isEvmChain(authSessionData?.currentNetwork)?  <ProfileEvm /> : null}
            {isSolanaNetwork(authSessionData?.currentNetwork)? <div>Not EVM</div> : null}
        </div>
    )
}