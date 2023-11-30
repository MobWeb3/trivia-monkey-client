import React from 'react';
import './IgnorantMonkeyCard.css';
import ignoranceAvatar from '../../assets/monkeys_avatars/ignorance-buchon-monkey3-200x200.png';
import { Avatar, Indicator } from '@mantine/core';

type CardProps = {
    message: string;
    score: number;
};

const IgnoranceMonkeyCard: React.FC<CardProps> = ({ message, score }) => {
    return (
        <div className="card">
            <Indicator inline label={score} size={24} color='#246B55' position="bottom-center" withBorder>
                <Avatar
                    size="xl"
                    radius="sm"
                    src={ignoranceAvatar}
                />
            </Indicator>
            <div className="message-bubble">
                {message}
            </div>
        </div>
    );
};

export default IgnoranceMonkeyCard;