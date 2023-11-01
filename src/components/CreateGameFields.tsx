import React from 'react';
import { Input, SegmentedControl, Modal, Group, Badge, Button, Flex } from '@mantine/core';
import { NumberInputComponent } from '../components/NumberInput';
import { IconPacman } from '@tabler/icons-react';
import ModalContent from './ModalContent';

interface CreateGameFormProps {
    setNickname: (nickname: string) => void;
    setNumberPlayers: (numberPlayers: string) => void;
    setPointsToWin: (pointsToWin: string) => void;
    setSelectedChips: (selectedChips: string[]) => void;
    openModal: () => void;
    closeModal: () => void;
    opened: boolean;
    numberPlayers: string;
    selectedChips: string[];
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({
    setNickname,
    setNumberPlayers,
    setPointsToWin,
    setSelectedChips,
    openModal,
    closeModal,
    opened,
    numberPlayers,
    selectedChips
}) => {
    return (
        <Flex
            gap="lg"
            justify="center"
            align="center"
            direction="column"
        >
            <div style={{ width: '90%', margin: '0 auto' }}>  {/* This div will constrain the width and center the Input component */}
                <Input
                    leftSection={<IconPacman />}
                    placeholder="Your Name"
                    radius="md"
                    styles={{
                        input: {
                            textAlign: 'center',
                            width: '100%',  // Ensure the input field takes up the full width of the div
                        },
                    }}
                    onChange={(e) => setNickname(e.currentTarget.value)}
                />
            </div>

            <div style={{ width: '90%', margin: '0 auto' }}>  {/* This div will constrain the width and center the Input component */}

            <NumberInputComponent setNumberSelected={setNumberPlayers} />
            </div>
            <SegmentedControl
                data={[
                    { value: '10', label: '10' },
                    { value: '20', label: '20' },
                    { value: '30', label: '30' },
                ]}
                onChange={(value) => setPointsToWin(value)}
            />
            <Modal opened={opened} onClose={closeModal} title="Pick topic" radius={'lg'} padding={'xl'}>
                <ModalContent setSelectedChips={setSelectedChips} numberOfPlayers={parseInt(numberPlayers)}></ModalContent>
                {/* Modal content */}
            </Modal>
            <Group justify="center">
                <Badge size="lg" radius="lg" variant="dot">
                    Selected topics: {selectedChips.join(', ')}
                </Badge>
                <Button onClick={openModal}>Pick a topic</Button>
            </Group>
        </Flex>
    );
};

export default CreateGameForm;