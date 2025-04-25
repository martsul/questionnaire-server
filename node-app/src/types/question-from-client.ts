import { QuestionType } from "./questions-type.js";

export type QuestionFromClient = {
    id: string;
    type: QuestionType;
    title: string;
    index: number;
    inStatistic: boolean;
    answers: string[] | null;
};
