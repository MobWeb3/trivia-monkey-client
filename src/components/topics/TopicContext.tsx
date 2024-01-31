import React, { createContext, useState } from 'react';
import { Topic } from '../../game-domain/Topic';

// topic is has an id and a nam

type TopicContextType = {
    topics: Topic[];
    setTopics: (topics: Topic[]) => void;
};

// Create the context with default values
export const TopicContext = createContext<TopicContextType>({
    topics: [],
    setTopics: () => { },
});

interface TopicProviderProps {
    children: React.ReactNode;
}

export const TopicProvider: React.FC<TopicProviderProps> = ({ children }) => {
    const [topics, setTopics] = useState<Topic[]>([]);

    return (
        <TopicContext.Provider value={{ topics, setTopics }}>
            {children}
        </TopicContext.Provider>
    );
};