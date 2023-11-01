import React from 'react';
import { Input, SegmentedControl, Modal, Flex, Container } from '@mantine/core';
import { NumberInputComponent } from '../components/NumberInput';
import { IconPacman } from '@tabler/icons-react';
import ModalContent from './ModalContent';
import CustomButton from './CustomButton';

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
    handlePlayButtonClick: () => void;
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
    selectedChips,
    handlePlayButtonClick
}) => {
    return (
        <Flex
            gap="lg"
            justify="center"
            align="center"
            direction="column"
            w="100%"
        >
            <div style={{ width: '100%', margin: '0 auto' }}>  {/* This div will constrain the width and center the Input component */}
                <Input
                    leftSection={<IconPacman />}
                    placeholder="Your Name"
                    radius="md"
                    styles={{
                        input: {
                            textAlign: 'center',
                            width: '100%',  // Ensure the input field takes up the full width of the div
                            background: '#DAD5D5',
                            opacity: 1,
                            fontFamily: 'umbrage2',
                            fontSize: '32px',
                        },
                    }}
                    onChange={(e) => setNickname(e.currentTarget.value)}
                />
            </div>

            <div style={{ width: '100%', margin: '0 auto' }}>  {/* This div will constrain the width and center the Input component */}
                <NumberInputComponent setNumberSelected={setNumberPlayers} />
            </div>

            <Container fluid bg="#FDD673" w="100%" className='container-number-players'>
                Number of Levels
            </Container>
            <SegmentedControl w='100%'
                fullWidth size="xl"
                color="gray"
                data={[
                    { value: '10', label: '10' },
                    { value: '20', label: '20' },
                    { value: '30', label: '30' },
                ]}
                onChange={(value) => setPointsToWin(value)}

                style={{ fontFamily: 'umbrage2', fontSizeAdjust: '' }}
            />
            <Modal opened={opened} onClose={closeModal} title="Pick topic" radius={'lg'} padding={'xl'}>
                <ModalContent setSelectedChips={setSelectedChips} numberOfPlayers={parseInt(numberPlayers)}></ModalContent>
                {/* Modal content */}
            </Modal>
            {/* <Group justify="center">
                <Badge size="lg" radius="lg" variant="dot">
                    Selected topics: {selectedChips.join(', ')}
                </Badge>
                <Button onClick={openModal}>Pick a topic</Button>
            </Group> */}
            <CustomButton 
                fontSize={"32px"}
                onClick={openModal}
                background='linear-gradient(to bottom right, #FDD673, #D5B45B)'
                color='#2B2C21'
            >Pick a topic</CustomButton>
            <CustomButton onClick={handlePlayButtonClick}>Create Game</CustomButton>
        </Flex>
    );
};

export default CreateGameForm;