import { useState } from 'react';
import { Container, Flex, Grid } from '@mantine/core';
import { NumberInput, ActionIcon } from '@mantine/core';
import './NumberInput.css'

export type NumberInputProps = {
    setNumberSelected: (value: any) => void;
};

export function NumberInputComponent({ setNumberSelected }: NumberInputProps) {
    const [value, setValue] = useState(2);

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
        <Flex direction="column" align="center" style={{ width: '100%' }} gap="sm" wrap="nowrap">
            <Container fluid bg="#FDD673" w="100%" className='container-number-players'>
                Number of Players
            </Container>

            <Grid justify="center" align="flex-start" >
                <Grid.Col span={4} h='100%'>
                    <ActionIcon w="100%"  variant="default" onClick={() => decrement()} style={{ marginTop: '0px' }}>
                        <strong>-</strong>
                    </ActionIcon>
                </Grid.Col>
                <Grid.Col span={4}>
                    <NumberInput
                        hideControls
                        value={value}
                        onChange={(val) => {
                            const numberVal = Number(val);
                            setValue(numberVal);
                            setNumberSelected(numberVal);
                        }}
                        max={6}
                        min={1}
                        step={1}
                        styles={{ input: { textAlign: 'center' } }}
                    />
                </Grid.Col >
                <Grid.Col span={4}>
                    <ActionIcon w="100%" h='100%' variant="default" onClick={() => increment()} style={{ marginTop: '0px' }}>
                        <strong>+</strong>
                    </ActionIcon>
                </Grid.Col>

            </Grid>
        </Flex>
    );
}
