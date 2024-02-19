import React, { useState } from 'react';
import { Button } from '@mantine/core';
import { colors } from '../colors';

interface OptionButtonProps extends React.ComponentProps<typeof Button> {
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: () => void;
    background?: string;
    color?: string;
    fontSize?: string;
}

export const OptionButton: React.FC<OptionButtonProps> = ({ children, background, color, fontSize, ...props }) => {
    const [buttonDimensions] = useState({ height: '3rem', padding: '1rem' });

    const customStyle = {
        background: background || `linear-gradient(to bottom right, ${colors.purple}, ${colors.purple2})`,
        border: '1px solid #2c2c2c',
        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        borderRadius: '8px',
        fontSize: fontSize || '40px',  // Fixed font size
        color: color || colors.yellow2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'umbrage2',
        ...buttonDimensions,  // Spread in height and padding
        ...props.style,       // Spread in any other style props to override the custom styles if needed
    };

    return (
        <Button {...props} style={customStyle}>
            {children}
        </Button>
    );
};

export default OptionButton;