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
    // Define your prop types here
    // setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
    // selectedTopics: string[];
    numberOfPlayers: number;
    style?: React.CSSProperties;
    // setCustomTopicEntries?: (customTopicEntries: string[]) => void;
    // setCustomTopicEntriesIds?: (customTopicEntriesIds: string[]) => void;
    closeModal?: () => void;
    children?: React.ReactNode;
};

export const PickTopicComponent = ({...props }: ModalContentProps) => {

    const [chipsAvailable, setChipsAvailable] = useState<number>(0);
    const [chipDisabled, setChipDisabled] = useState(false);
    const { topics } = useContext(TopicContext);
    
    // Number of questions the player can choose in total
    const numberQuestions = numberOfQuestionPlayerCanChoose(props.numberOfPlayers);

    useEffect(() => {
        console.log(`selectedTopics:`, topics.map((topic) => topic[0]));
        // console.log("chipsAvailable: ", chipsAvailable);
        const chipsAvailable = () => {
            // console.log("selectedChipsRef.current.length: ", selectedChips.length);
            // console.log("numberQuestions: ", numberQuestions);
            // return selectedChips.length < numberQuestions;
            // Get the number of chips available
            const chipsAvailable = numberQuestions - topics.length;
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
        , [numberQuestions, topics]);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            ...props.style
        }}>
            <DisplayBadge text="Topics" fontSize='30px' />

            {/* <Chip.Group multiple>
                <Group justify="center" gap="sm">

                    {Object.values(GeneralTopics).map((topicKey, index) => {
                        const sequentialColor = mantineColors[index % mantineColors.length];
                        return <Chip
                            key={`${topicKey}-${isChecked}`}
                            checked={isChecked(index, topicKey)}
                            color={sequentialColor}
                            value={topicKey}
                            radius={'md'}
                            size={'xl'}
                            disabled={chipDisabled && !selectedTopics.includes(topicKey)}
                            variant="filled"
                            style={{
                                border: '1px solid #2c2c2c',
                                borderRadius: '15%',
                                fontFamily: 'umbrage2',
                            }}
                    

                            onChange={(value) => console.log('changed ', value)}
                            onClick={() => handleChipSelect(topicKey)}
                            >
                                {topicKey}
                        </Chip>
                    })}
                    <DisplayBadge text="Topic of choice" fontSize='30px' />
                    <CustomTopicEntries 
                        entrySize={chipsAvailable} 
                        setCustomTopicEntriesIds = {(props.setCustomTopicEntriesIds)}
                        setCustomTopicEntries = {props.setCustomTopicEntries}
                    />
                    <CustomButton fontSize='30px' onClick={props.closeModal}>Done</CustomButton>
                </Group>
            </Chip.Group> */}

            <div style={{ padding: '5px' }}>
                <ChipGroup
                    options={Object.values(GeneralTopics)}
                    disabled={chipDisabled}
                />
                <DisplayBadge text="Topic of choice" fontSize='30px' />
                <CustomTopicEntries
                    entrySize={chipsAvailable}
                    // setSelectedTopicIds={(props.setCustomTopicEntriesIds)}
                    // setSelectedTopic={setSelectedTopics}
                    // selectedTopics={selectedTopics}
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
