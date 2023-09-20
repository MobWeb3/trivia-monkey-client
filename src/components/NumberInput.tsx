import { useState } from 'react';
import { Text } from '@mantine/core';

import { NumberInput, Group, ActionIcon, rem } from '@mantine/core';


export type NumberInputProps = {
    // Define your prop types here
    setNumberSelected: (value: any) => void;
};

export function NumberInputComponent({ setNumberSelected }: NumberInputProps) {
    const [value, setValue] = useState(1);

    const increment = () => {
        if (value < 6) {
            setValue(value + 1);
            setNumberSelected(value + 1);
        }
    };

    const decrement = () => {
        if (value > 1) {
            setValue(value - 1);
            setNumberSelected(value - 1);
        }
    };


    return (
        <Group >
            <Text fz="md">Number of Players</Text>
            <ActionIcon size={42} variant="default" onClick={() => decrement()}>
                –
            </ActionIcon>

            <NumberInput
                hideControls
                value={value}
                onChange={(val) =>{
                    const numberVal = Number(val);
                    setValue(numberVal);
                    setNumberSelected(numberVal);
                }}
                max={6}
                min={1}
                step={1}
                styles={{ input: { width: rem(100), textAlign: 'center' } }}
            />

            <ActionIcon size={42} variant="default" onClick={() => increment()}>
                +
            </ActionIcon>
        </Group>
    );
}