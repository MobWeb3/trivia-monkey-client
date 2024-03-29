import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Container, Grid, Text } from '@mantine/core';
import './QuestionModal.css';
import { IconSquareLetterA, IconSquareLetterB, IconSquareLetterC, IconSquareLetterD } from '@tabler/icons-react';
import { useTimer } from 'react-timer-hook';
import { Question } from '../game-domain/Question';
import { sendMessage } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';
import { SessionData } from '../screens/SessionData';
import useLocalStorageState from 'use-local-storage-state'
import { IGNORANCE_MONKEY_NAME } from '../game-domain/Session';
import { addPointToPlayer } from '../mongo/SessionHandler';
import { Topic } from '../game-domain/Topic';

const placeholderQuestionText = "What is the capital of the United States of America?"
const placeholderOptionA = "Lorem Ipsum long anser that is very long, and more text";

interface QuestionModalProps {
    open: boolean;
    onClose: () => void;
    question: Question | null;
    topic: Topic | null;
    onExpire: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ open, onClose, question, topic, onExpire }) => {
    const iconA = <IconSquareLetterA size={24} />;
    const iconB = <IconSquareLetterB size={24} />;
    const iconC = <IconSquareLetterC size={24} />;
    const iconD = <IconSquareLetterD size={24} />;

    const OptionButton = {
        A: 0,
        B: 1,
        C: 2,
        D: 3
    } as const;

    const [selectedButton, setSelectedButton] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
    const [correctAnswerButton, setCorrectAnswerButton] = useState<number | null>(null);
    const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});
    const [showContinueButton, setShowContinueButton] = useState<boolean>(false);

    /* eslint-disable react-hooks/exhaustive-deps */
    // esling complains because it wants to add OptionButton.A, OptionButton.B, etc. to the dependency array
    // but we know they are constants.
    useEffect(() => {
        if (selectedButton !== null) {
            let correctAnswerButton = null;
            if (question?.answer === question?.options[0]) {
                correctAnswerButton = OptionButton.A;
            } else if (question?.answer === question?.options[1]) {
                correctAnswerButton = OptionButton.B;
            } else if (question?.answer === question?.options[2]) {
                correctAnswerButton = OptionButton.C;
            } else if (question?.answer === question?.options[3]) {
                correctAnswerButton = OptionButton.D;
            }
            setCorrectAnswerButton(correctAnswerButton);
        }
    }, [selectedButton, question]);

    useEffect(() => {
        // Reset state when a new question is received
        resetState();
    }, [question]);



    const handleButtonClick = async (optionIndex: number) => {
        // Avoid double clicking
        if (selectedButton !== null) {
            return;
        }

        setSelectedButton(optionIndex);
        const chosenAnswer = question?.options[optionIndex];
        const isValid = validateAnswer(chosenAnswer);
        setIsCorrect(isValid);
        setShowCorrectAnswer(true);
        setShowContinueButton(true);

        if (sessionData?.clientId === undefined || sessionData?.sessionId === undefined) {
            return;
        }

        if (isValid) {
            // Add point to player
            console.log('adding point to player', sessionData?.clientId);
            addPointToPlayer({ playerId: sessionData?.clientId, sessionId: sessionData?.sessionId });
        } else {
            // add point to ignorant monkey
            console.log('adding point to ignorant monkey');
            addPointToPlayer({ playerId: IGNORANCE_MONKEY_NAME, sessionId: sessionData?.sessionId });
        }

    }

    const resetState = async () => {
        setSelectedButton(null);
        setIsCorrect(null);
        setShowCorrectAnswer(false);
        setCorrectAnswerButton(null);
        setShowContinueButton(false);      
    }


    const time = new Date();
    time.setSeconds(time.getSeconds() + 20);

    const validateAnswer = (selectedOption?: string) => {
        console.log('selected options', selectedOption);
        console.log('Correct answer', question?.answer);
        console.log('correct answer button', correctAnswerButton);
        return selectedOption === question?.answer;
    }

    const getButtonColor = (optionIndex: number) => {
        // console.log(`getButtonColor: selectedButton: ${selectedButton}, optionIndex: ${optionIndex}, correctAnswerButton: ${correctAnswerButton}, showCorrectAnswer: ${showCorrectAnswer}`);
        const showGreen = showCorrectAnswer && correctAnswerButton === optionIndex;
        // console.log('showGreen', showGreen);
        if (showGreen) {
            // console.log('returning Green');
            return 'green';
        }
        if (selectedButton === optionIndex) {
            return isCorrect ? 'green' : 'red';
        }
        return 'default';
    }

    const getButtonVariant = (optionIndex: number) => {
        const displayCorrect = showCorrectAnswer && correctAnswerButton === optionIndex
        if (selectedButton === optionIndex || displayCorrect) {
            return 'light';
        }
        return "default";
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Modal
                opened={open}
                onClose={() => {
                    onClose();
                    resetState();
                }}
                radius="lg"
                size="90%"
                title={topic?.name}
                className='centered-modal'
                centered
                withCloseButton={false}
                transitionProps={{ transition: 'slide-up', exitDuration: 600 }}
            >
                <Card shadow="lg" padding="md">
                    <Card.Section withBorder inheritPadding >
                        <div className="timer-container">
                            <TimerComponent expiryTimestamp={time} onExpire={onExpire} />
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
                                        color={getButtonColor(OptionButton.A)}
                                        variant={getButtonVariant(OptionButton.A)}
                                        onClick={() => handleButtonClick(OptionButton.A)}>
                                        {question?.options[0] ?? placeholderOptionA}
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Button size='sm'
                                        justify="left"
                                        fullWidth
                                        leftSection={iconB}
                                        color={getButtonColor(OptionButton.B)}
                                        variant={getButtonVariant(OptionButton.B)}
                                        onClick={() => handleButtonClick(OptionButton.B)}>
                                        {question?.options[1] ?? placeholderOptionA}
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Button size='sm'
                                        justify="left"
                                        fullWidth
                                        leftSection={iconC}
                                        color={getButtonColor(OptionButton.C)}
                                        variant={getButtonVariant(OptionButton.C)}
                                        onClick={() => handleButtonClick(OptionButton.C)}>
                                        {question?.options[2] ?? placeholderOptionA}
                                    </Button>
                                </Grid.Col>
                                {question?.options[3] && <Grid.Col span={12}>
                                    <Button size='sm'
                                            justify="left"
                                            fullWidth
                                            leftSection={iconD}
                                            color={getButtonColor(OptionButton.D)}
                                            variant={getButtonVariant(OptionButton.D)}
                                            onClick={() => handleButtonClick(OptionButton.D)}>
                                        {question?.options[3]}
                                    </Button>
                                </Grid.Col>}
                            </Grid>
                        </Container>
                    </Card.Section>
                    {showContinueButton ? <Button onClick={() => sendMessage(Messages.HIDE_QUESTION, {})}>
                        Continue
                    </Button> : null}
                </Card>
            </Modal>
        </div>
    );
}

export interface TimerProps {
    expiryTimestamp: Date;
    onExpire: () => void;
}

function TimerComponent({ expiryTimestamp, onExpire }: TimerProps) {
    const {
        seconds,
        minutes,
    } = useTimer({ expiryTimestamp, onExpire });

    return (
        <div>
            <Text size="xl"
                fw={900}
                variant="gradient"
                gradient={{ from: 'gray', to: 'indigo', deg: 111 }}>
                {minutes}:{seconds}</Text>
        </div>
    );
}

export default QuestionModal;