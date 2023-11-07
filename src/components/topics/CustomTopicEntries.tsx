import React from 'react';
import { Input } from '@mantine/core';

interface CustomTopicEntriesProps {
    entrySize: number;
}

const CustomTopicEntries: React.FC<CustomTopicEntriesProps> = ({ entrySize }) => {
    const inputs = [];

    for (let i = 0; i < entrySize; i++) {
        inputs.push(<Input 
            key={i}
            size="lg"
            radius="lg" 
            placeholder="Enter topic..."
            style={{ 
                margin: '20px', 
                bottom: '10px',
            }} 
            />
        );
    }

    return <div>{inputs}</div>;
};

export default CustomTopicEntries;