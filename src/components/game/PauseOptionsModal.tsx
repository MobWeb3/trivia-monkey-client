// Modal component when the user presses the pause button

import { Modal } from '@mantine/core';
import React from 'react';
import { ActionOptionsComponent } from './ActionOptionsComponent';
import { colors } from '../colors';

interface PauseOptionsProps {
    opened: boolean;
    closeModal: () => void;

}

// component
const PauseOptionsModal: React.FC<PauseOptionsProps> = ({ opened, closeModal }) => {

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
            <ActionOptionsComponent numberOfPlayers={0}/>
        </Modal>
    );
};

export default PauseOptionsModal;