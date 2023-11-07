import React, { useState } from 'react';
// import { Input } from '@mantine/core';
import { Autocomplete } from '@mantine/core';
import { IconSearch, IconCircleLetterX} from '@tabler/icons-react';

interface CustomTopicEntriesProps {
    entrySize: number;
}

const largeData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index + 1}`);



const CustomTopicEntries: React.FC<CustomTopicEntriesProps> = ({ entrySize }) => {
    const inputs = [];

    // const [dropdownOpened, setDropdownOpened] = React.useState(false);

    // const [inputValue, setInputValue] = useState('');
    // const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const toggleDropdown = (index:number) => {
        const newDropdownOpenedArray = [...dropdownOpenedArray];
        newDropdownOpenedArray[index] = !newDropdownOpenedArray[index];
        setDropdownOpenedArray(newDropdownOpenedArray);
    }

    const [inputValues, setInputValues] = useState<string[]>(new Array(entrySize).fill(''));
    const [timers, setTimers] = useState<(number | undefined)[]>(new Array(entrySize).fill(undefined));
    const [dropdownOpenedArray, setDropdownOpenedArray] = useState<boolean[]>(new Array(entrySize).fill(false));
        
    const handleInputChange = (index: number, value: string) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    
        // Clear the existing timer
        if (timers[index]) {
            clearTimeout(timers[index]);
        }
    
        // Start a new timer
        const newTimers = [...timers];
        newTimers[index] = setTimeout(() => {
            console.log(`After 4 seconds for input ${index} the value is ${value}`);
        }, 4000) as unknown as number;
        setTimers(newTimers);
    };

        // Toggle off all of the dropdowns when clicking anywhere outside of the dropdown
        // if dropdownOpenedArray[index] is true

    for (let i = 0; i < entrySize; i++) {
        inputs.push(<Autocomplete 
            key={i}
            size="xl"
            radius="lg" 
            placeholder="Enter topic..."
            data={largeData}
            limit={5}
            style={{ 
                marginTop:  '10px',
                marginBottom: '10px',
            }}
            dropdownOpened={dropdownOpenedArray[i]}
            rightSection={
                <div 
                    className="iconWrapper"
                    onClick={() => toggleDropdown(i)} 
                    // onMouseOver={() => console.log('Icon hovered!')} 
                    style={{ cursor: 'pointer' }}
                >
                   {dropdownOpenedArray[i] ?  <IconCircleLetterX /> : <IconSearch /> }
                </div>
            }
            rightSectionProps={{ style: { cursor: 'pointer' } }}
            rightSectionPointerEvents="auto"
            onChange={(value) =>handleInputChange(i, value)}
            value={inputValues[i]}
            />
        );
    }

    return <div>{inputs}</div>;
};

export default CustomTopicEntries;