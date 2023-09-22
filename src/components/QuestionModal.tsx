import React from 'react';
import { Modal, Button, Card, Container, Grid, Text } from '@mantine/core';
import './QuestionModal.css';
import { IconSquareLetterA, IconSquareLetterB, IconSquareLetterC } from '@tabler/icons-react';
import { useTimer } from 'react-timer-hook';
import { Question } from '../game-domain/Question';

interface QuestionModalProps {
    open: boolean;
    onClose: () => void;
    onAnswerSubmit: () => void;
    question: Question | null;
    topic: string | null;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ open, onClose, question, topic }) => {
    const iconA = <IconSquareLetterA size={24} />;
    const iconB = <IconSquareLetterB size={24} />;
    const iconC = <IconSquareLetterC size={24} />;

    const time = new Date();
    time.setSeconds(time.getSeconds() + 20);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Modal
                opened={open}
                onClose={onClose}
                radius="lg"
                size="70%"
                title={topic}
                className='centered-modal'
                centered
                withCloseButton = {false}
            >
                <Card shadow="lg" padding="lg">
                    <Card.Section withBorder inheritPadding >
                        <div className="timer-container">
                            <TimerComponent expiryTimestamp={time} />
                        </div>
                    </Card.Section>
                    <Card.Section py="lg" px="lg">
                        <Text size="xl" fw={700} >
                            { question?.question}
                        </Text>
                    </Card.Section>
                    <Card.Section withBorder inheritPadding py="lg">
                        <Container>
                            <Grid>
                                <Grid.Col span={10}>
                                    <Button color='grey' size='md' justify="left" fullWidth leftSection={iconA} variant="default">
                                        {question?.options[0]}
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={10}>
                                    <Button size='md' justify="left" fullWidth leftSection={iconB} variant="default">
                                        {question?.options[1]}
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={10}>
                                    <Button size='md' justify="left" fullWidth leftSection={iconC} variant="default">
                                        {question?.options[2]}
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={10}>
                                    <Button size='md' justify="left" fullWidth leftSection={iconC} variant="default">
                                        {question?.options[3]}
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        </Container>
                    </Card.Section>
                </Card>
            </Modal>
        </div>
    );
}

export interface TimerProps {
    expiryTimestamp: Date;
}

function TimerComponent({ expiryTimestamp }: TimerProps) {
    const {
        seconds,
        minutes,
        restart,
    } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

    return (
        <div>

            <Text size="xl"
                  fw={900}
                  variant="gradient"
                  gradient={{ from: 'gray', to: 'indigo', deg: 111 }}>
                    {minutes}:{seconds}</Text>  
            <button onClick={() => {
                // Restarts to 5 minutes timer
                const time = new Date();
                time.setSeconds(time.getSeconds() + 20);
                restart(time)
            }}>Restart</button>
        </div>
    );
}

export default QuestionModal;