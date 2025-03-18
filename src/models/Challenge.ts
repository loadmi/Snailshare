export enum ChallengeType {
    ADDITION = 'addition',
    SUBTRACTION = 'subtraction',
    MULTIPLICATION = 'multiplication',
}

export enum DifficultyLevel {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}

export interface Challenge {
    type: ChallengeType;
    difficulty: DifficultyLevel;
    operands: number[];
    answer: number;
    questionText: string;
    boostMultiplier: number; // How much this challenge will boost speed
}
