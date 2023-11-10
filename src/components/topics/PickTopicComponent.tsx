// import { Chip, Group } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { GeneralTopics, numberOfQuestionPlayerCanChoose } from '../../game-domain/Topics';
import "./PickTopicComponent.css"
import DisplayBadge from './DisplayBadge';
import CustomTopicEntries from './CustomTopicEntries';
import CustomButton from '../CustomButton';
import { ChipGroup } from './Chip';
import { TopicContext } from './TopicContext';

type ModalContentProps = {
    numberOfPlayers: number;
    style?: React.CSSProperties;
    closeModal?: () => void;
    children?: React.ReactNode;
};

export const PickTopicComponent = ({numberOfPlayers, ...props }: ModalContentProps) => {

    // Number of questions the player can choose in total
    const numberQuestions = numberOfQuestionPlayerCanChoose(numberOfPlayers);

    // const [chipsAvailable, setChipsAvailable] = useState<number>(0);
    const [customEntriesAvailable, setCustomEntriesAvailable] = useState<number>(numberQuestions);
    const [chipDisabled, setChipDisabled] = useState(false);
    const { topics } = useContext(TopicContext);
    


    useEffect(() => {
        console.log(`selectedTopics:`, topics.map((topic) => topic[0]));

        // Get number of selected chips. Chips are selected if label is not empty and id is empty.
        const selectedChips = () => {
            let count = 0;
            topics.forEach((topic) => {
                if (topic[1] === "") {
                    count++;
                }
            });
            return count;
        }

        console.log("selectedChips: ", selectedChips());

        //Get count number of occupied entries. entries that contain an id
        function occupiedEntriesNumber() {

            //iterate through topics and count the number of entries that contain an id
            let count = 0;
            topics.forEach((topic) => {
                if (topic[1] !== "") {
                    count++;
                }
            });

            return count;
        }
        console.log("occupiedEntriesNumber: ", occupiedEntriesNumber());

        const entriesAvailable = () => {
            // Get the number of chips available
            const entriesAvailable = numberQuestions - selectedChips();
            console.log("entriesAvailable: ", entriesAvailable);
            return entriesAvailable;
        }

        // return the count number of chips available
        const chipsAvailable = () => {
            // Get the count of chips available. Combination of chips and custom entries should not exceed numberQuestions
            return numberQuestions - occupiedEntriesNumber() - selectedChips();
        }
        console.log("chipsAvailable: ", chipsAvailable());

        // If there are chips available, enable the chips
        if (chipsAvailable() > 0) {
            setChipDisabled(false)
        } else { // Otherwise, disable the rest of the chips
            setChipDisabled(true);
        }
        setCustomEntriesAvailable(entriesAvailable());
    }
        , [numberQuestions, topics]);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            ...props.style
        }}>
            <DisplayBadge text="Topics" fontSize='30px' />

            <div style={{ padding: '5px' }}>
                <ChipGroup
                    options={Object.values(GeneralTopics)}
                    disabled={chipDisabled}
                />
                <DisplayBadge text="Topic of choice" fontSize='30px' />
                <CustomTopicEntries
                    entrySize={customEntriesAvailable}
                />

            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <CustomButton
                    fontSize='30px'
                    onClick={props.closeModal}
                    style={{ marginTop: '0px' }}
                >Done</CustomButton>
            </div>
        </div>
    );
};

export default PickTopicComponent;
