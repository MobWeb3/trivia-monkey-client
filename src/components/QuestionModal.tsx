import React, { useState } from 'react';
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

    const [selectedButton, setSelectedButton] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);


    enum SelectedButton {
        A = 0,
        B = 1,
        C = 2,
        D = 3
    }

    const handleButtonClick = (optionIndex: number) => {
        setSelectedButton(optionIndex);
        const isValid = validateAnswer(question?.options[optionIndex]);
        setIsCorrect(isValid);
    }


    const time = new Date();
    time.setSeconds(time.getSeconds() + 20);

    const validateAnswer = (selectedOption?: string) => {
        console.log('validateAnswer', selectedOption, question?.answer);
        return selectedOption === question?.answer;
    }

    const getButtonColor = (optionIndex: number) => {
        if (selectedButton === optionIndex) {
            return isCorrect ? 'green' : 'red';
        }
        return 'default';
    }

    const getButtonVariant = (optionIndex: number) => {
        if (selectedButton === optionIndex) {
            return 'light';
        }
        return "default";
    }

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
                withCloseButton={false}
            >
                <Card shadow="lg" padding="md">
                    <Card.Section withBorder inheritPadding >
                        <div className="timer-container">
                            <TimerComponent expiryTimestamp={time} />
                        </div>
                    </Card.Section>
                    <Card.Section py="md" px="md">
                        <Text size="xl" fw={700} >
                            {question?.question ?? placeholderQuestionText}
                        </Text>
                    </Card.Section>
                    <Card.Section withBorder py="md">
                        <Container fluid>
                            <Grid>
                                <Grid.Col span={12}>
                                    <Button
                                        size='sm'
                                        justify="left"
                                        fullWidth
                                        leftSection={iconA}
                                        color={getButtonColor(SelectedButton.A)}
                                        variant={getButtonVariant(SelectedButton.A)}
                                        onClick={() => handleButtonClick(SelectedButton.A)}>
                                        {question?.options[0] ?? placeholderOptionA}
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Button size='sm'
                                        justify="left"
                                        fullWidth
                                        leftSection={iconB}
                                        color={getButtonColor(SelectedButton.B)}
                                        variant={getButtonVariant(SelectedButton.B)}
                                        onClick={() => handleButtonClick(SelectedButton.B)}>
                                        {question?.options[1] ?? placeholderOptionA}
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Button size='sm'
                                        justify="left"
                                        fullWidth
                                        leftSection={iconC}
                                        color={getButtonColor(SelectedButton.C)}
                                        variant={getButtonVariant(SelectedButton.C)}
                                        onClick={() => handleButtonClick(SelectedButton.C)}>
                                        {question?.options[2] ?? placeholderOptionA}
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Button size='sm'
                                            justify="left"
                                            fullWidth
                                            leftSection={iconD}
                                            color={getButtonColor(SelectedButton.D)}
                                            variant={getButtonVariant(SelectedButton.D)}
                                            onClick={() => handleButtonClick(SelectedButton.D)}>
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