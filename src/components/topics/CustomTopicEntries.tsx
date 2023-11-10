import React, { useState } from 'react';
import { ComboboxEntry } from './ComboBoxEntry';

interface CustomTopicEntriesProps {
    entrySize: number;
    selectedTopics?: string[];
    setSelectedTopic?: (topics: string[]) => void;
    setSelectedTopicIds?: (topicIds: string[]) => void;
}

const CustomTopicEntries: React.FC<CustomTopicEntriesProps> = ({ entrySize, setSelectedTopic, setSelectedTopicIds, selectedTopics }) => {
    const inputs = [];
    
    const [inputIds, setInputIds] = useState<string[]>(new Array(entrySize).fill(''));

    // useEffect(() => {
    //     // inputValuesRef.current = inputValues;
    //     console.log(`inputValues `, inputValues);
    //     console.log('inputIds', inputIds);

    // }, [entrySize, inputValues, inputIds]); // Empty dependency array means this effect runs once on mount

    if (!selectedTopics) {
        return;
    }

    for (let i = 0; i < entrySize; i++) {
        inputs.push(
            <ComboboxEntry
                key={i}
                value={selectedTopics[i] ?? ''}
                setValue={(newValue) => {
                    const newInputValues = [...selectedTopics];
                    newInputValues[i] = newValue;
                    if (setSelectedTopic)
                        setSelectedTopic(newInputValues);
                }}
                setId={(newId) => {
                    const newInputIds = [...inputIds];
                    newInputIds[i] = newId;
                    setInputIds(newInputIds);
                    if (setSelectedTopicIds)
                        setSelectedTopicIds(newInputIds);
                }}
            />
        );
    }

    return <div>{inputs}</div>;
};

export default CustomTopicEntries;