import React, { createContext, useState } from 'react';

// topic is has an id and a name
export interface Topic {
    metaphor_id?: string; // Used for metaphor identification
    name: string;
    general_id?: string; // Used for general topic identification
}

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