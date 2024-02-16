import useLocalStorageState from 'use-local-storage-state';
import { AuthSessionData } from '../game-domain/AuthSessionData';
import { isEvmChain } from '../authentication/NetworkDetector';
import { ProfileEvm } from '../components/profile/evm/ProfileEvm';
import { isSolanaNetwork } from '../solana/helpers';
import { ProfileSolana } from '../components/profile/solana/ProfileSolana';

export function Profile() {
    const [authSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});
    return (
        <div>
            {isEvmChain(authSessionData?.currentNetwork)?  <ProfileEvm /> : null}
            {isSolanaNetwork(authSessionData?.currentNetwork)? <ProfileSolana/> : null}
        </div>
    )
}