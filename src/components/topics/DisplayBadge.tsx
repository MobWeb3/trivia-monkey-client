import React from 'react';

interface DisplayBadgeProps {
  background?: string;
  fontSize?: string;
  text: string;
  color?: string;
  style?: React.CSSProperties;
}

const DisplayBadge: React.FC<DisplayBadgeProps> = ({ background, fontSize, text, color, ...props }) => {
    const customStyle = {
        background: background || 'linear-gradient(to bottom right, #DAD5D5, #B8B3B3)',
        border: '1px solid #2c2c2c',
        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        fontSize: fontSize || '40px',
        padding: '10px',
        color: color || '#6562DF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'umbrage2',
        margin: '20px', // Add margin of 10px to all sides
        
        ...props.style,       // Spread in any other style props to override the custom styles if needed

    };

    return <div style={customStyle}>{text}</div>;
};

export default DisplayBadge;