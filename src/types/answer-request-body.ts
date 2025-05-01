export type AnswerRequestBody = {
    answers: Record<string, string | string[]>;
    formId: number;
    answerOnEmail: boolean;
};
