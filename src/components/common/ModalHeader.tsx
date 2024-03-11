import { ActionIcon } from '@mantine/core';
import React from 'react';
import { IconArrowBack } from '@tabler/icons-react';


interface ModalHeaderProps {
  onPressedBack?: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ onPressedBack }) => {

  return (
      <ActionIcon
        variant="gradient"
        size="xl"
        aria-label="Gradient action icon"
        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
        onClick={onPressedBack}
      >
        <IconArrowBack />
      </ActionIcon>
  );
};

export default ModalHeader;