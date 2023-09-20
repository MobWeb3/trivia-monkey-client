import React from 'react';
import { Modal, Button, Card, Container, Grid, HoverCard } from '@mantine/core';
import './QuestionModal.css';
import { IconSquareLetterA } from '@tabler/icons-react';

interface QuestionModalProps {
    open: boolean;
    onClose: () => void;
    onAnswerSubmit: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ open, onClose, onAnswerSubmit }) => {
    const iconA = <IconSquareLetterA size={24} />;

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Modal
                opened={open}
                onClose={onClose}
                title="Question"
                size="70%"
                className='centered-modal'
                centered
            >
                <Card shadow="xs" padding="md">
                    <Container>
                        <Grid>
                            <Grid.Col span={10}>
                            <Button justify="left" fullWidth leftSection={iconA} variant="default">
                                Button label
                            </Button>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                                    Book classic tour now
                                </Button>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <h2>Answer</h2>
                                <p>answer</p>
                            </Grid.Col>
                        </Grid>
                    </Container>
                    <Button onClick={onAnswerSubmit}>Submit Answer</Button>
                </Card>
            </Modal>
        </div>
    );
}

export default QuestionModal;