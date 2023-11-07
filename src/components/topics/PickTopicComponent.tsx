import { Chip, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GeneralTopics, numberOfQuestionPlayerCanChoose } from '../../game-domain/Topics';
import "./PickTopicComponent.css"
import DisplayBadge from './DisplayBadge';

// Define the Mantine colors
const mantineColors = ['blue', 'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange', 'red', 'pink', 'purple', 'deepPurple', 'lightBlue', 'indigo'];


type ModalContentProps = {
    // Define your prop types here
    setSelectedChips: (value: any) => void;
    numberOfPlayers: number;
};


export const PickTopicComponent = (props: ModalContentProps) => {

    const [selectedChips, setSelectedChips] = useState<string[]>([]);
    // const selectedChipsRef = useRef<string[]>([]);
    // const chipDisabledRef = useRef<boolean>(false);
    const [chipDisabled, setChipDisabled] = useState(false);

    // lets create a useEffect that handless the rest of the chips that are not selected
    // wether they are disabled or not

    const numberQuestions = numberOfQuestionPlayerCanChoose(props.numberOfPlayers);

    useEffect(() => {
        const chipsAvailable = () => {
            console.log("selectedChipsRef.current.length: ", selectedChips.length);
            console.log("numberQuestions: ", numberQuestions);
            return selectedChips.length < numberQuestions;
        };

        // If chips are available, then disable the rest of the chips
        if (chipsAvailable()) {
            setChipDisabled(false);
        } else { // Otherwise, disable the rest of the chips
            setChipDisabled(true);
        }
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

                <DisplayBadge text="Topics" style={{ width: '100%' }}/>
                {Object.values(GeneralTopics).map((topicKey, index) => { 
                    const sequentialColor = mantineColors[index % mantineColors.length];
                    return <Chip
                        key={index}
                        color={sequentialColor}
                        value={topicKey}
                        radius={'md'}
                        size={'xl'}
                        disabled = {chipDisabled && !selectedChips.includes(topicKey)}
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
    );
};

export default PickTopicComponent;
