import { ClientImg } from "./client-img.js";
import { QuestionFromClient } from "./question-from-client.js";

export type UpdateFormData = {
    formId: number;
    title: string;
    description: string;
    img: ClientImg;
    theme: string;
    isPublic: boolean;
    tags: string[];
    users: number[];
    questions: QuestionFromClient[];
};
