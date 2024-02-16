import { Affix, ActionIcon } from '@mantine/core';
import React from 'react';
import { PauseIcon } from './game/assets/icons';

interface GameHeaderProps {
  onPause?: () => void;
  onResume?: () => void;
  onExit?: () => void;
  openModal: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({openModal}) => {
    
    return (
          <Affix position={{ top: 20, right: 20 }}>
            <ActionIcon
                variant="gradient"
                size="xl"
                aria-label="Gradient action icon"
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                onClick={openModal}
            >
                <PauseIcon />
            </ActionIcon>
          </Affix>
      );
};

export default GameHeader;