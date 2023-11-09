import React from 'react';

interface SelectedTopicProps {
  background?: string;
  fontSize?: string;
  text: string;
  color?: string;
  style?: React.CSSProperties;
}

const SelectedTopic: React.FC<SelectedTopicProps> = ({ background, fontSize, text, color, ...props }) => {
    const customStyle = {
        background: background || '#9995DB',
        border: '1px solid #2c2c2c',
        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.1)',
        borderRadius: '30px',
        fontSize: fontSize || '30px',
        padding: '10px',
        color: color || '#FED11B',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'umbrage2',
        // margin: '10px', // Add margin of 10px to all sides
        
        ...props.style,       // Spread in any other style props to override the custom styles if needed

    };

    return <div style={customStyle}>{text}</div>;
};

export default SelectedTopic;