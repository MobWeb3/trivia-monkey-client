import React from 'react';
import { CustomButton } from '../CustomButton';

interface NftButtonProps {
  text: string;
  onClick?: () => void;
}

export const ActionButton: React.FC<NftButtonProps> = ({ text, ...props }) => {
  return (
    <CustomButton
      {...props}
      style={{
        fontSize: '1.5rem',
        height: '4rem',
      }}
    >
      {text}
    </CustomButton>
  );
};