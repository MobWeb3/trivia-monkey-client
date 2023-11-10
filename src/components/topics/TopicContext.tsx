import React, { createContext, useState } from 'react';

export type Topic = [string, string]; // Tuple type for topics

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