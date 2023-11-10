import React, { useContext } from 'react';
import SelectedTopic from './SelectedTopic';
import { TopicContext } from './TopicContext';

interface SelectedTopicEntriesProps {
    entrySize: number;
}

const SelectedTopicEntries: React.FC<SelectedTopicEntriesProps> = ({ entrySize }) => {
    const inputs = [];

    const { topics } = useContext(TopicContext);

    for (let i = 0; i < entrySize; i++) {
        if (topics[i][0] === undefined) continue;
        inputs.push(
            <SelectedTopic
                key={i}
                text={topics[i][0]}
            /> 
        );
    }

    return <div style={{
        width: '100%',
        height: '100%',
    }}>{inputs}</div>;
};

export default SelectedTopicEntries;