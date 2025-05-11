export type NumberAnswer = { min: number; max: number; average: number };

export type TextAnswer = { answer: string; count: number };

export type AggregatedAnswers = Record<string, NumberAnswer | TextAnswer[]>;
