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
    flawless: number;
    totalGuesses: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: {};
    lastPlayed: Date;
    cumulativeScore: number;
    score: number;
};
