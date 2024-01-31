import { useContext, useState } from 'react';
import { Combobox, ComboboxProps, TextInput, useCombobox } from '@mantine/core';
import { IconSearch, IconCircleLetterX, IconLoader } from '@tabler/icons-react';
import { getTopicEntries } from '../../metaphor/metaphor';
import { TopicContext } from './TopicContext';
import './ComboBoxEntry.css';
import { Topic } from '../../game-domain/Topic';

interface MyComboboxProps extends ComboboxProps {
    // other props...
    savedValue: string
}

export function ComboboxEntry({ savedValue }: MyComboboxProps) {
    const combobox = useCombobox();
    const [data, setData] = useState<{ value: string, label: string }[]>([]);
    const [searching, setSearching] = useState(false);
    const [currentValue, setCurrentValue] = useState<string>(savedValue);
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

    return (
        <Combobox
            onOptionSubmit={(optionValue) => {
                // console.log("optionValue: ", optionValue);
                const topic: Topic = {
                    name: optionValue,
                    metaphor_id: getOptionId(optionValue)};
                //previous topics and add new topic
                setTopics([...topics, topic]);
                combobox.closeDropdown();
                setCurrentValue(optionValue);
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
                        fontFamily: 'umbrage2',
                    }}
                    onChange={(event) => {
                        const value = event.currentTarget.value;
                        setCurrentValue(value);
                        combobox.openDropdown();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    leftSection={
                        <div
                            onClick={async () => {

                                if (currentValue.length > 2 && !searching) {
                                    console.log("searching for: ", currentValue);
                                    setSearching(true);
                                    const response = (await getTopicEntries(currentValue));
                                    setSearching(false);
                                    console.log("response: ", response);
                                    setData(response.slice(0, 10).map((item) => ({ value: item.id, label: item.title })));
                                    combobox.openDropdown();
                                }
                            }}
                        >
                            {
                                searching ? <div className="icon-loader">
                                    <IconLoader/>
                              </div> : <IconSearch />
                            }
                        </div>
                    }
                    rightSection={
                        <div
                            onClick={() => {
                                setData([]);
                                // remove the topic from the list to deselect it
                                const newTopics = topics.filter((topic) => { 
                                    // console.log("topic: ", topic);
                                    // console.log("currentValue: ", currentValue);
                                    return topic.name !== currentValue}
                                );
                                // console.log("newTopics: ", newTopics);
                                setTopics(newTopics);
                                setCurrentValue('');
                            }}
                        >
                          {  currentValue.length > 2 ? <IconCircleLetterX /> : null}
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