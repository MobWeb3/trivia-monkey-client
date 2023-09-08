import React, { useState, useRef } from 'react';
import { Text } from '@mantine/core';

import { NumberInput, Group, ActionIcon, NumberInputHandlers, rem } from '@mantine/core';


export type NumberInputProps = {
    // Define your prop types here
    setNumberSelected: (value: any) => void;
};

export function NumberInputComponent(_props: NumberInputProps) {
    const [value, setValue] = useState<number | ''>(1);
    const handlers = useRef<NumberInputHandlers>();

    return (
        <Group spacing={5}>
            <Text fz="md">Number of Players</Text>
            <ActionIcon size={42} variant="default" onClick={() => handlers.current?.decrement()}>
                –
            </ActionIcon>

            <NumberInput
                hideControls
                value={1}
                onChange={(val) => _props.setNumberSelected(val)}
                handlersRef={handlers}
                max={6}
                min={1}
                step={1}
                styles={{ input: { width: rem(100), textAlign: 'center' } }}
            />

            <ActionIcon size={42} variant="default" onClick={() => handlers.current?.increment()}>
                +
            </ActionIcon>
        </Group>
    );
}