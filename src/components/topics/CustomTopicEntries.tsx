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
            size="xl"
            radius="lg" 
            placeholder="Enter topic..."
            style={{ 
                marginTop:  '10px',
                marginBottom: '10px',
            }} 
            />
        );
    }

    return <div>{inputs}</div>;
};

export default CustomTopicEntries;