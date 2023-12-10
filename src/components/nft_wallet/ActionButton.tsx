import React from 'react';
import { CustomButton } from '../CustomButton';

interface NftButtonProps {
  text: string;
}

export const ActionButton: React.FC<NftButtonProps> = ({ text }) => {
  return (
    <CustomButton
      style={{
        fontSize: '1.5rem',
        height: '4rem',
      }}
    >
      {text}
    </CustomButton>
  );
};