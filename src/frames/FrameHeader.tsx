import { Affix } from '@mantine/core';
import React from 'react';
import OptionButton from '../components/game/OptionButton';

interface FrameInitialHeaderProps {
    onConnect?: () => void;
    onResume?: () => void;
    onExit?: () => void;
    openModal?: () => void;
    isConnected?: boolean;
}

const FrameInitiaHeader: React.FC<FrameInitialHeaderProps> = ({ onConnect, isConnected }) => {

    return (

        <Affix position={{ top: 20, right: 20 }}>
            <OptionButton fontSize='1rem' onClick={onConnect}>
                {isConnected ? 'Connected' : 'Connect Wallet'}
            </OptionButton>
        </Affix>
    );
};

export default FrameInitiaHeader;