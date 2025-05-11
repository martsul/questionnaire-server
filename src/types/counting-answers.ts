import { NumberAnswer, TextAnswer } from "./aggregated-answers.js";

type Answer = {
    type: string;
    title: string;
    answers: NumberAnswer | TextAnswer[];
};

export type CountingAnswers = Record<string, Answer[]>;
