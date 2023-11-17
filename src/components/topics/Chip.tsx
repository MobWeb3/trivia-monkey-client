import React, { useContext } from 'react';
import { Topic, TopicContext } from './TopicContext';

type ChipProps = {
    label: string;
    isSelected: boolean;
    onSelect: () => void;
    color: string;
    disabled: boolean;
};

const mantineColors = ['#f44336', '#ce7e00', '#8fce00', '#2986cc', '#c90076', '#8e7cc3', '#a64d79'];

// Custom Chip component
export const Chip: React.FC<ChipProps> = ({ label, isSelected, onSelect, color, disabled }) => {
    return (
        <button
            style={{
                backgroundColor: isSelected ? color : 'white',
                // borderColor: color,
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                padding: '5px',
                borderRadius: '30px',
                fontFamily: 'umbrage2',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
            }}
            onClick={!disabled ? onSelect : undefined}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

type ChipGroupProps = {
    options: string[];
    disabled: boolean;
};


// Custom ChipGroup component
export const ChipGroup: React.FC<ChipGroupProps> = ({ options, disabled }) => {

    const { topics, setTopics } = useContext(TopicContext);

    const isSelected = (option:string) => {
        // get all the topic labels
        const topicLabelsSelected = topics.map((topic) => topic[0]);
        return topicLabelsSelected.includes(option)
    };
        
    const handleSelect = (option: string) => {
        // get all the topic labels
        const topicLabelsSelected = topics.map((topic) => topic[0]);
        const isSelected = topicLabelsSelected.includes(option);

        if (isSelected) {
            // remove the topic from the list to deselect it
            const newTopics = topics.filter((topic) => topic[0] !== option);
            setTopics(newTopics);
        } else {
            // add the topic to the list to select it
            const newTopic = [option, ''] as Topic;
            setTopics([...topics, newTopic]);
        }
    };

    return (
        <div style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
            gap: '5px', 
            justifyContent: 'center' 
        }}>
            {options.map((option, index) => (
                <Chip
                    key={option}
                    label={option}
                    isSelected={isSelected(option)}
                    onSelect={() => handleSelect(option)}
                    color={mantineColors[index % mantineColors.length]}
                    disabled={disabled && !isSelected(option)}
                />
            ))}
        </div>
    );
};