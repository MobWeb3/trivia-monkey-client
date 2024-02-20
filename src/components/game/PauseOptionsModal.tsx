// Modal component when the user presses the pause button

import { Modal } from '@mantine/core';
import React, { useEffect } from 'react';
import { ActionOptionsComponent } from './ActionOptionsComponent';
import { colors } from '../colors';
import useLocalStorageState from 'use-local-storage-state';
import { AuthSessionData } from '../../game-domain/AuthSessionData';

interface PauseOptionsProps {
    opened: boolean;
    closeModal: () => void;
}

// component
const PauseOptionsModal: React.FC<PauseOptionsProps> = ({ opened, closeModal }) => {
    
    // get network from useLocalStorageState
    const [authSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});

    useEffect(() => {
        console.log('PauseOptionsModal: network: ', authSessionData?.currentNetwork);
        console.log('current public key: ', authSessionData?.currentUserPublicKey);
    }, [authSessionData?.currentNetwork, authSessionData?.currentUserPublicKey]);

    return (
        <Modal
            yOffset={'5dvh'}
            opened={opened}
            onClose={closeModal}
            radius={'xl'}
            withCloseButton={false}
            styles={{
                body: { backgroundColor: colors.blue_turquoise }, 
            }}
        >
            <ActionOptionsComponent/>
        </Modal>
    );
};

export default PauseOptionsModal;