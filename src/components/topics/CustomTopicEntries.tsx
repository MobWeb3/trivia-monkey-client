import React, { useContext } from 'react';
import { ComboboxEntry } from './ComboBoxEntry';
import { TopicContext } from './TopicContext';

interface CustomTopicEntriesProps {
    entrySize: number;
}

const CustomTopicEntries: React.FC<CustomTopicEntriesProps> = ({ entrySize}) => {
    const inputs = [];
    const { topics } = useContext(TopicContext);

    // Filter only the topics with a metaphor_id
    const filteredTopics = topics.filter((topic) => topic.metaphor_id !== undefined);

    const getValue = (index: number) => {
        // console.log("entrySize: ", entrySize);
        // console.log ('filteredTopics: ', filteredTopics);
        // console.log(`topic name: ${topics[index].name}`);
        // return value of the topic at index
        return filteredTopics[index]?.name ?? "";
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