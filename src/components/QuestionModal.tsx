import React from 'react';
import { Modal, Button, Card, Container, Grid, Text } from '@mantine/core';
import './QuestionModal.css';
import { IconSquareLetterA, IconSquareLetterB, IconSquareLetterC, IconSquareLetterD } from '@tabler/icons-react';
import { useTimer } from 'react-timer-hook';
import { Question } from '../game-domain/Question';

const placeholderQuestionText = "What is the capital of the United States of America?"
const placeholderOptionA = "Lorem Ipsum long anser that is very long, and more text";

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
    const iconD = <IconSquareLetterD size={24} />;

    const time = new Date();
    time.setSeconds(time.getSeconds() + 20);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Modal
                opened={open}
                onClose={onClose}
                radius="lg"
                size="90%"
                title={topic}
                className='centered-modal'
                centered
                withCloseButton = {false}
            >
                <Card shadow="lg" padding="md">
                    <Card.Section withBorder inheritPadding >
                        <div className="timer-container">
                            <TimerComponent expiryTimestamp={time} />
                        </div>
                    </Card.Section>
                    <Card.Section py="md" px="md">
                        <Text size="xl" fw={700} >
                            { question?.question ?? placeholderQuestionText}
                        </Text>
                    </Card.Section>
                    <Card.Section withBorder py="md">
                        <Container fluid>
                            <Grid>
                                <Grid.Col span={12}>
                                    <Button size='sm' justify="left" fullWidth leftSection={iconA} variant="default">
                                        {question?.options[0] ?? placeholderOptionA}
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Button size='sm' justify="left" fullWidth leftSection={iconB} variant="default">
                                        {question?.options[1] ?? placeholderOptionA}
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Button size='sm' justify="left" fullWidth leftSection={iconC} variant="default">
                                        {question?.options[2] ?? placeholderOptionA}
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Button size='sm' justify="left" fullWidth leftSection={iconD} variant="default">
                                        {question?.options[3] ?? placeholderOptionA}
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
            {/* <button onClick={() => {
                // Restarts to 5 minutes timer
                const time = new Date();
                time.setSeconds(time.getSeconds() + 20);
                restart(time)
            }}>Restart</button> */}
        </div>
    );
}

export default QuestionModal;