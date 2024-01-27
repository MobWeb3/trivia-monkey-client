import React, { useContext } from 'react';
import SelectedTopic from './SelectedTopic';
import { TopicContext } from './TopicContext';
import { removeSuffixes } from '../../game-domain/metaphor/TopicLabelFilter';

interface SelectedTopicEntriesProps {
    entrySize: number;
}

const SelectedTopicEntries: React.FC<SelectedTopicEntriesProps> = ({ entrySize }) => {
    const inputs = [];

    const { topics } = useContext(TopicContext);

    for (let i = 0; i < entrySize; i++) {
        if (topics[i].name === undefined) continue;
        inputs.push(
            <SelectedTopic
                key={i}
                text={removeSuffixes(topics[i].name)}
            /> 
        );
    }

    return <div style={{
        width: '100%',
        height: 'auto',
    }}>{inputs}</div>;
};

export default SelectedTopicEntries;