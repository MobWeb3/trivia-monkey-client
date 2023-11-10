import React from 'react';

type ChipProps = {
    label: string;
    isSelected: boolean;
    onSelect: () => void;
    color: string;
    disabled: boolean;
};

const mantineColors = ['blue', 'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange', 'red', 'pink', 'purple', 'deepPurple', 'lightBlue', 'indigo'];


// Custom Chip component
export const Chip: React.FC<ChipProps> = ({ label, isSelected, onSelect, color, disabled }) => {
    return (
        <button
            style={{
                backgroundColor: isSelected ? color : 'white',
                // borderColor: color,
                borderRadius: '10%',
                // padding: '10px 20px',
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
    selectedOptions: string[];
    setSelectedOptions: (options: string[]) => void;
    disabled: boolean;
};


// Custom ChipGroup component
export const ChipGroup: React.FC<ChipGroupProps> = ({ options, selectedOptions, setSelectedOptions, disabled }) => {
    const handleSelect = (option: string) => {
        const isSelected = selectedOptions.includes(option);
        if (isSelected) {
            setSelectedOptions(selectedOptions.filter((o) => o !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
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
                    isSelected={selectedOptions.includes(option)}
                    onSelect={() => handleSelect(option)}
                    color={mantineColors[index % mantineColors.length]}
                    disabled={disabled && !selectedOptions.includes(option)}
                />
            ))}
        </div>
    );
};