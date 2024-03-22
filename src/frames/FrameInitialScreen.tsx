import { useContext, useState } from 'react';
import styles from '../frames/FrameInitialScreen.module.css'
import { CustomButton } from '../components/CustomButton';
import { Container, Flex, Input, Modal, SegmentedControl } from '@mantine/core';
import { IconPacman } from '@tabler/icons-react';
import SelectedTopicEntries from '../components/topics/SelectedTopicEntries';
import { useDisclosure } from '@mantine/hooks';
import { TopicContext } from '../components/topics/TopicContext';
import { colors } from '../components/colors';
import ChooseTopicComponent from './components/ChooseTopicComponent';

export const FrameInitialScreen = () => {

    const [numberQuestions, setNumberQuestions] = useState(10);
    const [opened, { open, close }] = useDisclosure(false);
    const { topics } = useContext(TopicContext);

    const handlePlayButtonClick = () => {
        console.log('Play button clicked');
        console.log('Frame title: ', frameTitle);
    };

    const [frameTitle, setFrameTitle] = useState('');

    return (
        <div className={styles.main}>
            <Flex
                gap="sm"
                justify="center"
                align="center"
                direction="column"
                w="100%"
                h="auto" // Fixed height
            >
                <Input
                    leftSection={<IconPacman />}
                    placeholder="Frame Title"
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
                    onChange={(e) => setFrameTitle(e.currentTarget.value)}
                />

                <Container fluid bg="#FDD673" w="100%" className='container-number-players'>
                    Number of Questions
                </Container>
                <SegmentedControl w='100%'
                    fullWidth size="xl"
                    color="gray"
                    data={[
                        { value: '1', label: '1' },
                        { value: '5', label: '5' },
                        { value: '10', label: '10' },
                    ]}
                    onChange={(value) => setNumberQuestions(parseInt(value))}

                    style={{ fontFamily: 'umbrage2', marginBottom: '10px' }}
                />
                <CustomButton
                    fontSize={"32px"}
                    onClick={open}
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
                        marginTop: '5%',
                        marginBottom: '5%',
                    }}
                >Create Game
                </CustomButton>
            </Flex>
            <Modal
                yOffset={'5dvh'}
                opened={opened}
                onClose={close}
                radius={'xl'}
                withCloseButton={false}
                styles={{
                    body: { backgroundColor: colors.blue_turquoise },
                }}
            >
                <ChooseTopicComponent
                    numberOfQuestions={numberQuestions}
                    closeModal={close}
                    style={
                        {
                            backgroundColor: colors.blue_turquoise,
                        }
                    }
                />
            </Modal>
        </div>
    );
}

export default FrameInitialScreen;