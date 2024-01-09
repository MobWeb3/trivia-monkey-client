export type Player = {
    email: string;
    name: string;
    avatar?: string;
}

export type PlayerOrderType = {
    turn_position: number;
    email: string;
    _id: string;
}