import { Chip, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GeneralTopics, numberOfQuestionPlayerCanChoose } from '../../game-domain/Topics';
import "./PickTopicComponent.css"
import DisplayBadge from './DisplayBadge';
import CustomTopicEntries from './CustomTopicEntries';

// Define the Mantine colors
const mantineColors = ['blue', 'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange', 'red', 'pink', 'purple', 'deepPurple', 'lightBlue', 'indigo'];


type ModalContentProps = {
    // Define your prop types here
    setSelectedChips: (value: any) => void;
    numberOfPlayers: number;
    style?: React.CSSProperties;
};


export const PickTopicComponent = (props: ModalContentProps) => {

    const [selectedChips, setSelectedChips] = useState<string[]>([]);
    const [chipsAvailable, setChipsAvailable] = useState<number>(0);
    const [chipDisabled, setChipDisabled] = useState(false);

    // lets create a useEffect that handless the rest of the chips that are not selected
    // wether they are disabled or not

    const numberQuestions = numberOfQuestionPlayerCanChoose(props.numberOfPlayers);

    useEffect(() => {
        const chipsAvailable = () => {
            console.log("selectedChipsRef.current.length: ", selectedChips.length);
            console.log("numberQuestions: ", numberQuestions);
            // return selectedChips.length < numberQuestions;
            // Get the number of chips available
            const chipsAvailable = numberQuestions - selectedChips.length;
            console.log("chipsAvailable: ", chipsAvailable);
            return chipsAvailable;
        }
        // If chips are available, then disable the rest of the chips
        // const chipsAvailable = chipsAvailable();
        if (chipsAvailable() > 0) {
            setChipDisabled(false);
            
        } else { // Otherwise, disable the rest of the chips
            setChipDisabled(true);
        }
        setChipsAvailable(chipsAvailable());
    }
        , [numberQuestions, selectedChips]);



    const handleChipSelect = (chipValue: string) => {
        if (selectedChips.includes(chipValue)) {
            // If chipValue is already in selectedChips, remove it
            setSelectedChips(selectedChips.filter(chip => chip !== chipValue));
        } else {
            // If chipValue is not in selectedChips, add it
            setSelectedChips([...selectedChips, chipValue]);
        }
    };



    return (
        <div style={{
            ...props.style
        }}>
            <Chip.Group multiple>
                <Group justify="center" gap="lg">
                    {/* <Select
                label="Select topic"
                placeholder="Search and select"
                searchable
                data={['React', 'Angular', 'Svelte', 'Vue']}
                />  */}
                    {/* <Chip
                        key={"customTopic"}
                        color={'teal'}
                        value={"Custom Topic"}
                        radius={'md'}
                        disabled = {!selectedChips.includes('customTopic')}
                        size={'md'}
                        variant="filled"
                        onClick={() => handleChipSelect("customTopic")}>{"Write any topic..."}
                </Chip> */}

                    <DisplayBadge text="Topics" fontSize='30px' style={{ width: '100%' }} />
                    {Object.values(GeneralTopics).map((topicKey, index) => {
                        const sequentialColor = mantineColors[index % mantineColors.length];
                        return <Chip
                            key={index}
                            color={sequentialColor}
                            value={topicKey}
                            radius={'md'}
                            size={'xl'}
                            disabled={chipDisabled && !selectedChips.includes(topicKey)}
                            variant="filled"
                            style={{
                                border: '1px solid #2c2c2c',
                                borderRadius: '15%',
                            }}
                            onClick={() => handleChipSelect(topicKey)}>{topicKey}
                        </Chip>
                    })}
                </Group>
            </Chip.Group>
            <DisplayBadge text="Topic of choice" fontSize='30px' />
            <CustomTopicEntries entrySize={chipsAvailable}/>
        </div>
    );
};

export default PickTopicComponent;
