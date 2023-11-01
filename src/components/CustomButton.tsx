import React, { useEffect, useState } from 'react';
import { Button } from '@mantine/core';

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ children, ...props }) => {
    const [buttonDimensions, setButtonDimensions] = useState({ height: '10vh', padding: '20px 40px' });

    useEffect(() => {
        const updateDimensions = () => {
            const viewportHeight = window.innerHeight;
            const newHeight = Math.min(100, viewportHeight / 10) + 10;  // Adjust divisor to get desired scaling
            const newPadding = `${newHeight / 5}px ${newHeight / 2.5}px`;  // Adjust ratios to get desired padding
            setButtonDimensions({ height: `${newHeight}px`, padding: newPadding });
        };

        // Update dimensions on mount
        updateDimensions();

        // Update dimensions on window resize
        window.addEventListener('resize', updateDimensions);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    const customStyle = {
        backgroundColor: '#6562DF',
        fontSize: '40px',  // Fixed font size
        color: '#FED11B',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...buttonDimensions,  // Spread in height and padding
        ...props.style,       // Spread in any other style props to override the custom styles if needed
    };

    return (
        <Button {...props} style={customStyle}>
            {children}
        </Button>
    );
};

export default CustomButton;
