import React from 'react';
import './IgnorantMonkeyCard.css';
import ignoranceAvatar from '../../assets/monkeys_avatars/ignorance-buchon-monkey3-200x200.png';
import { Avatar } from '@mantine/core';

type CardProps = {
    message: string;
};

const IgnoranceMonkeyCard: React.FC<CardProps> = ({ message }) => {
    return (
        <div className="card">
            <Avatar
                size="xl"
                radius="sm"
                src={ignoranceAvatar}
            />
            <div className="message-bubble">
                {message}
            </div>
        </div>
    );
};

export default IgnoranceMonkeyCard;