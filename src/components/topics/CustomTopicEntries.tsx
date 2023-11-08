import React, { useEffect, useState } from 'react';
import { ComboboxEntry } from './ComboBoxEntry';

interface CustomTopicEntriesProps {
    entrySize: number;
}

const CustomTopicEntries: React.FC<CustomTopicEntriesProps> = ({ entrySize }) => {
    const inputs = [];

    // const toggleDropdown = (index: number) => {
    //     const newDropdownOpenedArray = [...dropdownOpenedArray];
    //     newDropdownOpenedArray[index] = !newDropdownOpenedArray[index];
    //     setDropdownOpenedArray(newDropdownOpenedArray);

    //     console.log(`clicked on search index: ${index}`);
    // }

    const [inputValues, setInputValues] = useState<string[]>(new Array(entrySize).fill(''));
    const [inputIds, setInputIds] = useState<string[]>(new Array(entrySize).fill(''));

    useEffect(() => {
        // inputValuesRef.current = inputValues;
        console.log(`inputValues `, inputValues);
        console.log('inputIds', inputIds);

    }, [entrySize, inputValues, inputIds]); // Empty dependency array means this effect runs once on mount

    // useEffect(() => {
    //     // open the dropdown if it is not already opened

    //     for (let i = 0; i < entrySize; i++) {
    //         if (dropdownOpenedArray[i] === false && inputValues[i].length > 1) {
    //             toggleDropdown(i);
    //         }
    //     }
    // }, []);


    for (let i = 0; i < entrySize; i++) {
        inputs.push(
            <ComboboxEntry
                key={i}
                value={inputValues[i] ?? ''} 
                setValue={(newValue) => {
                    const newInputValues = [...inputValues];
                    newInputValues[i] = newValue;
                    setInputValues(newInputValues);
                }}
                setId={(newId) => {
                    const newInputIds = [...inputIds];
                    newInputIds[i] = newId;
                    setInputIds(newInputIds);
                }}
            />
        );
    }

    return <div>{inputs}</div>;
};

export default CustomTopicEntries;