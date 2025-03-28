export type Champion = {
    id: number;
    set: number;
    name: string;
    cost: number;
    gender: number;
    range: number;
    traits: string[];
    icon: string;
};

export type Stats = {
    gamesPlayed: number;
    oneShots: number;
    totalGuesses: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: {};
    lastPlayed: Date;
};

export type Graph = {
    nodes: Champion[];
    edges: Map<number, Set<number>>;
};
