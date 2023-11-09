import React, {  } from 'react';
import SelectedTopic from './SelectedTopic';

interface SelectedTopicEntriesProps {
    entrySize: number;
    selectedTopicEntries: string[];
    // setCustomTopicEntries: (customTopicEntries: string[]) => void;
    // setCustomTopicEntriesIds: (customTopicEntriesIds: string[]) => void;
}

const SelectedTopicEntries: React.FC<SelectedTopicEntriesProps> = ({ entrySize, selectedTopicEntries }) => {
    const inputs = [];

    for (let i = 0; i < entrySize; i++) {
        inputs.push(
            <SelectedTopic
                key={i}
                text={selectedTopicEntries[i]}
            /> 
        );
    }

    return <div style={{
        width: '100%',
        height: '100%',
    }}>{inputs}</div>;
};

export default SelectedTopicEntries;