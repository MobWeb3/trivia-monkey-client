import React, { useContext } from 'react';
import { ComboboxEntry } from './ComboBoxEntry';
import { TopicContext } from './TopicContext';

interface CustomTopicEntriesProps {
    entrySize: number;
}

const CustomTopicEntries: React.FC<CustomTopicEntriesProps> = ({ entrySize}) => {
    const inputs = [];
    const { topics } = useContext(TopicContext);

    const getValue = (index: number) => {

        if (topics && topics.length > 0) {
            if (topics[index] === undefined) return '';
            if (topics[index][1] === '') return '';
            return topics[index][0];
        }
        return '';
    }

    for (let i = 0; i < entrySize; i++) {
        inputs.push(
            <ComboboxEntry
                key={i}
                savedValue={getValue(i)}
            />
        );
    }

    return <div>{inputs}</div>;
};

export default CustomTopicEntries;