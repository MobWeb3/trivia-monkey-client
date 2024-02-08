import useLocalStorageState from 'use-local-storage-state';
import { AuthSessionData } from '../../../game-domain/AuthSessionData';

export function Profile() {
    const [authSessionData, setAuthSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});


    return (
        <div>

        </div>
    )
}