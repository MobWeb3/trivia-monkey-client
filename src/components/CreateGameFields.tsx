import React, { useContext } from 'react';
import { Input, SegmentedControl, Modal, Flex, Container } from '@mantine/core';
import { NumberInputComponent } from '../components/NumberInput';
import { IconPacman } from '@tabler/icons-react';
import PickTopicComponent from './topics/PickTopicComponent';
import CustomButton from './CustomButton';
import './CreateGameFields.css';
import SelectedTopicEntries from './topics/SelectedTopicEntries';
import { TopicContext } from './topics/TopicContext';

interface CreateGameFormProps {
    setNickname: (nickname: string) => void;
    setNumberPlayers: (numberPlayers: string) => void;
    setPointsToWin: (pointsToWin: string) => void;
    openModal: () => void;
    closeModal: () => void;
    opened: boolean;
    numberPlayers: string;
    handlePlayButtonClick: () => void;
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({
    setNickname,
    setNumberPlayers,
    setPointsToWin,
    openModal,
    closeModal,
    opened,
    numberPlayers,
    handlePlayButtonClick
}) => {
    const { topics } = useContext(TopicContext);

    // useEffect(() => {
    //     // console.log('topics in CreateGameFields component: ', topics.map((topic) => topic[0]));
    // } , [topics]);

    return (
        <>
            <Flex
                gap="sm"
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

                    style={{ fontFamily: 'umbrage2', marginBottom: '10px' }}
                />
                <CustomButton
                    fontSize={"32px"}
                    onClick={openModal}
                    background='linear-gradient(to bottom right, #FDD673, #D5B45B)'
                    color='#2B2C21'
                    style={{
                        marginTop: '5px',
                        marginBottom: '5px',
                    }}>Pick a topic
                </CustomButton>
                <SelectedTopicEntries 
                    entrySize={topics.length} 
                />
                <CustomButton
                    onClick={handlePlayButtonClick}
                    style={{
                        marginTop: '5px',
                        marginBottom: '5px',
                    }}
                >Create Game
                </CustomButton>
            </Flex>
            <div className='ModalContent'>
                {/* # For some reason I need to position to the left around -%13 to center the modal. */}
                <Modal
                    pos={"absolute"}
                    left={'-13%'}
                    yOffset={'5dvh'}
                    opened={opened}
                    onClose={closeModal}
                    radius={'xl'}
                    withCloseButton={false}
                    styles={{
                        body: { backgroundColor: '#1AB2C7' },
                    }}
                >
                        <PickTopicComponent
                            numberOfPlayers={parseInt(numberPlayers)}
                            closeModal={closeModal}
                            style={
                                {
                                    backgroundColor: '#1AB2C7',
                                }
                            }
                        />
                </Modal>
            </div>
        </>
    );
};

export default CreateGameForm;