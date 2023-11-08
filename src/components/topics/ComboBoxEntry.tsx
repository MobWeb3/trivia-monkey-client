import { useState } from 'react';
import { Combobox, ComboboxProps, TextInput, useCombobox } from '@mantine/core';
import { IconSearch, IconCircleLetterX } from '@tabler/icons-react';

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];

interface MyComboboxProps extends ComboboxProps {
    // other props...
    key: string | number;
}

export function ComboboxEntry(props: MyComboboxProps) {
    const combobox = useCombobox();
    const [value, setValue] = useState('');
    const shouldFilterOptions = !groceries.some((item) => item === value);
    const filteredOptions = shouldFilterOptions
        ? groceries.filter((item) => item.toLowerCase().includes(value.toLowerCase().trim()))
        : groceries;

    const options = filteredOptions.map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    ));

    return (
        <Combobox

            onOptionSubmit={(optionValue) => {
                setValue(optionValue);
                combobox.closeDropdown();
            }}
            store={combobox}
        >
            <Combobox.Target
                key={props.key}

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