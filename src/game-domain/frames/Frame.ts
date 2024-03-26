export interface MutableFrame {
    id?: string;
    name: string;
    metaphor_id: string;
    numberOfQuestions: number;
    // Add other properties as needed.
}

export declare type Frame = Readonly<MutableFrame>;