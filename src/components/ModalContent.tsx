import { Chip, DefaultMantineColor, Group, Select } from '@mantine/core';
import React, { useState } from 'react';
import { GeneralTopics, numberOfQuestionPlayerCanChoose } from '../game-domain/Topics';

// Define the Mantine colors
const mantineColors = ['blue', 'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange', 'red', 'pink', 'purple', 'deepPurple', 'lightBlue', 'indigo'];


type ModalContentProps = {
    // Define your prop types here
    setSelectedChips: (value: any) => void;
    numberOfPlayers: number;
};


export const ModalContent = (props: ModalContentProps) => {

    const [selectedChips, setSelectedChips] = useState<string[]>([]);
    const [chipsDisabled, setChipsDisabled] = useState(false);


    const numberQuestions = numberOfQuestionPlayerCanChoose(props.numberOfPlayers);

    // Inside ModalContent component
    const handleChipSelect = (chipValue: string) => {
        // Create a new array with the new chip value
        const newSelectedChips = [...selectedChips, chipValue];
    
        // Update the selectedChips state
        setSelectedChips(newSelectedChips);
        props.setSelectedChips(newSelectedChips);
    
        // Now check if the length of newSelectedChips is greater than or equal to numberQuestions
        if (newSelectedChips.length >= numberQuestions) {
            // alert(`You can only select up to ${numberQuestions} topics.`);
            setChipsDisabled(true);
        }
    };

    return (
        <Chip.Group multiple>
            <Group position="center">
                <Select
                label="Select topic"
                placeholder="Search and select"
                searchable
                nothingFound="No options"
                data={['React', 'Angular', 'Svelte', 'Vue']}
                /> 
                <Chip
                        key={"customTopic"}
                        color={'teal'}
                        value={"Custom Topic"}
                        radius={'md'}
                        disabled = {!selectedChips.includes('customTopic')}
                        size={'md'}
                        variant="filled"
                        onClick={() => handleChipSelect("customTopic")}>{"Write any topic..."}
                </Chip>
                {Object.values(GeneralTopics).map((topicKey, index) => { 
                    const sequentialColor = mantineColors[index % mantineColors.length];
                    return <Chip
                        key={index}
                        color={sequentialColor}
                        value={topicKey}
                        radius={'md'}
                        size={'md'}
                        disabled = {chipsDisabled && !selectedChips.includes(topicKey)}
                        variant="filled"
                        onClick={() => handleChipSelect(topicKey)}>{topicKey}
                    </Chip>
                })}
            </Group>
        </Chip.Group>
    );
};

export default ModalContent;
