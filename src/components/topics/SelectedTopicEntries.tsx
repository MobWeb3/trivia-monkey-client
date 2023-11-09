import React, {  } from 'react';
import SelectedTopic from './SelectedTopic';

interface SelectedTopicEntriesProps {
    entrySize: number;
    selectedTopics: string[];
    setSelectedTopics?: (customTopicEntries: string[]) => void;
    // selectedChips: string[];
}

const SelectedTopicEntries: React.FC<SelectedTopicEntriesProps> = ({ entrySize, selectedTopics }) => {
    const inputs = [];

    for (let i = 0; i < entrySize; i++) {
        inputs.push(
            <SelectedTopic
                key={i}
                text={selectedTopics[i]}
            /> 
        );
    }

    return <div style={{
        width: '100%',
        height: '100%',
    }}>{inputs}</div>;
};

export default SelectedTopicEntries;