import { Chip, DefaultMantineColor, Group, Select } from '@mantine/core';
import React from 'react';
import { GeneralTopics } from '../game-domain/Topics';

// Define the Mantine colors
const mantineColors = ['blue', 'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange', 'red', 'pink', 'purple', 'deepPurple', 'lightBlue', 'indigo'];


type ModalContentProps = {
    // Define your prop types here
    setSelectedChip: (value: any) => void;
};

export const ModalContent = (props: ModalContentProps) => {

    // Inside ModalContent component
    const handleChipSelect = (chipValue: string) => {
        props.setSelectedChip(chipValue);
    };

    return (
        <Chip.Group>
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
                        variant="filled"
                        onClick={() => handleChipSelect(topicKey)}>{topicKey}
                    </Chip>
                })}
            </Group>
        </Chip.Group>
    );
};

export default ModalContent;
