import { QuestionType } from "./questions-type.js";

export type QuestionForm = {
    id: string;
    formId: number;
    type: QuestionType;
    title: string;
    index: number;
    inStatistic: boolean;
    answers: string[] | null;
};
