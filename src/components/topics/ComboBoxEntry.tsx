import { useContext, useEffect, useState } from 'react';
import { Combobox, ComboboxProps, TextInput, useCombobox } from '@mantine/core';
import { IconSearch, IconCircleLetterX } from '@tabler/icons-react';
import { getTopicEntries } from '../../metaphor/metaphor';
import { Topic, TopicContext } from './TopicContext';

interface MyComboboxProps extends ComboboxProps {
    // other props...
    savedValue: string
}

export function ComboboxEntry({ savedValue }: MyComboboxProps) {
    const combobox = useCombobox();
    const [data, setData] = useState<{ value: string, label: string }[]>([]);
    const [searching, setSearching] = useState(false);
    const [currentValue, setCurrentValue] = useState<string>(savedValue);
    const [optionSelected, setOptionSelected] = useState(false);
    const { topics, setTopics } = useContext(TopicContext);

    const options = data.map((item) => (
        <Combobox.Option value={item.label} key={item.value}>
            {item.label}
        </Combobox.Option>
    ));

    // search for id in data given the label
    const getOptionId = (label: string) => {
        const item = data.find((item) => item.label === label);
        return item ? item.value : '';
    }

    useEffect(() => {
        console.log("topics: ", topics);
    }, [topics]);

    return (
        <Combobox
            onOptionSubmit={(optionValue) => {
                console.log("optionValue: ", optionValue);
                const topic: Topic = [optionValue, getOptionId(optionValue)];
                //previous topics and add new topic
                setTopics([...topics, topic]);
                combobox.closeDropdown();

                // replace right section with X
                setOptionSelected(true);
            }}
            store={combobox}
        >
            <Combobox.Target
                // key={key}
            >
                <TextInput
                    placeholder="Enter topic..."
                    value={currentValue}
                    size="xl"
                    radius="lg"
                    style={{
                        marginTop: '10px',
                        marginBottom: '10px',
                    }}
                    onChange={(event) => {
                        const value = event.currentTarget.value;
                        setCurrentValue(value);
                        combobox.openDropdown();
                        // combobox.updateSelectedOptionIndex();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    rightSection={
                        <div
                            onClick={async () => {
  
                                if (currentValue.length > 2 && !optionSelected) {
                                    console.log("searching for: ", currentValue);
                                    setSearching(true);
                                    const response = (await getTopicEntries(currentValue));
                                    setSearching(false);
                                    console.log("response: ", response);
                                    setData(response.slice(0, 10).map((item) => ({ value: item.id, label: item.title })));
                                    combobox.openDropdown();
                                }

                                if (optionSelected) {
                                    setData([]);
                                    // setValue('');
                                    setOptionSelected(false);
                                }
                            }}
                        >
                            {optionSelected ? <IconCircleLetterX /> : <IconSearch />}
                        </div>
                    }
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {options.length === 0 ? <Combobox.Empty >Nothing found</Combobox.Empty> : options}
                    <Combobox.Empty hidden={!searching}>Searching...</Combobox.Empty>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}