import { useState } from 'react';
import { Combobox, ComboboxProps, TextInput, useCombobox } from '@mantine/core';
import { IconSearch, IconCircleLetterX } from '@tabler/icons-react';
import { getTopicEntries } from '../../metaphor/metaphor';

interface MyComboboxProps extends ComboboxProps {
    // other props...
    key: string | number;
    value: string;
    setValue: (value: string) => void;
    setId: (value: string) => void;
}

export function ComboboxEntry({value, setValue, key, setId}: MyComboboxProps) {
    const combobox = useCombobox();
    const [data, setData] = useState<{ value: string, label: string }[]>([]);

    // const shouldFilterOptions = !groceries.some((item) => item === value);
    // const filteredOptions = shouldFilterOptions
    //     ? groceries.filter((item) => item.toLowerCase().includes(value.toLowerCase().trim()))
    //     : groceries;

    // const dataOptions = data.map((item) => item.value);

    const options = data.map((item) => (
        <Combobox.Option value={item.label} key={item.value}>
            {item.label}
        </Combobox.Option>
    ));

    // search for id in data given the label
    const getOptionId = (label:string) => {
        const item = data.find((item) => item.label === label);
        return item ? item.value : '';
    }

    return (
        <Combobox

            onOptionSubmit={(optionValue) => {
                console.log("optionValue: ", optionValue);
                setValue(optionValue);
                setId(getOptionId(optionValue));
                combobox.closeDropdown();
            }}
            store={combobox}
        >
            <Combobox.Target
                key={key}

            >
                <TextInput
                    placeholder="Enter topic..."
                    value={value}
                    size="xl"
                    radius="lg"
                    style={{
                        marginTop: '10px',
                        marginBottom: '10px',
                    }}
                    onChange={(event) => {
                        setValue(event.currentTarget.value);
                        combobox.openDropdown();
                        combobox.updateSelectedOptionIndex();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    rightSection={
                        <div
                            onClick={async (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                console.log("event: ", event)
                                console.log("clicked on search:", value);
                                combobox.openDropdown();
                                if (value.length > 2) {
                                    console.log("searching for: ", value);
                                    const response = (await getTopicEntries(value));
                                    console.log("response: ", response);
                                    setData(response.slice(0,10).map((item) => ({ value: item.id, label: item.title })));    
                                }
                            }}
                        >
                            {false ? <IconCircleLetterX /> : <IconSearch />}
                        </div>
                    }
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}