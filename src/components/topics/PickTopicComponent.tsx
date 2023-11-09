import { Chip, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GeneralTopics, numberOfQuestionPlayerCanChoose } from '../../game-domain/Topics';
import "./PickTopicComponent.css"
import DisplayBadge from './DisplayBadge';
import CustomTopicEntries from './CustomTopicEntries';
import CustomButton from '../CustomButton';

// Define the Mantine colors
const mantineColors = ['blue', 'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange', 'red', 'pink', 'purple', 'deepPurple', 'lightBlue', 'indigo'];

type ModalContentProps = {
    // Define your prop types here
    setSelectedChips: (value: any) => void;
    numberOfPlayers: number;
    style?: React.CSSProperties;
    setCustomTopicEntries?: (customTopicEntries: string[]) => void;
    setCustomTopicEntriesIds?: (customTopicEntriesIds: string[]) => void;
};

export const PickTopicComponent = (props: ModalContentProps) => {

    const [selectedChips, setSelectedChips] = useState<string[]>([]);
    const [chipsAvailable, setChipsAvailable] = useState<number>(0);
    const [chipDisabled, setChipDisabled] = useState(false);

    // Number of questions the player can choose in total
    const numberQuestions = numberOfQuestionPlayerCanChoose(props.numberOfPlayers);

    useEffect(() => {
        const chipsAvailable = () => {
            // console.log("selectedChipsRef.current.length: ", selectedChips.length);
            // console.log("numberQuestions: ", numberQuestions);
            // return selectedChips.length < numberQuestions;
            // Get the number of chips available
            const chipsAvailable = numberQuestions - selectedChips.length;
            // console.log("chipsAvailable: ", chipsAvailable);
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
                <Group justify="center" gap="sm">

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
                                fontFamily: 'umbrage2',
                            }}
                            onClick={() => handleChipSelect(topicKey)}>{topicKey}
                        </Chip>
                    })}
                    <DisplayBadge text="Topic of choice" fontSize='30px' />
                    <CustomTopicEntries 
                        entrySize={chipsAvailable} 
                        setCustomTopicEntriesIds = {(props.setCustomTopicEntriesIds)}
                        setCustomTopicEntries = {props.setCustomTopicEntries}
                    />
                    <CustomButton fontSize='30px'>Done</CustomButton>
                </Group>
            </Chip.Group>

        </div>
    );
};

export default PickTopicComponent;
