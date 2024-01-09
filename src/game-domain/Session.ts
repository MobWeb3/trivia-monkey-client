export type GameBoardState = { [key: string]: number };
export const IGNORANCE_MONKEY_NAME = 'IgnoranceMonkey';

export type PlayerOrderType = {
    turn_position: number;
    email: string;
    _id: string;
    points: number;
}