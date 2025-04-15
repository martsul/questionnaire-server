import { ClientImg } from "./client-img.js";
import { QuestionFromClient } from "./question-from-client.js";
import { UsersCollection } from "./users-collection.js";

export type UpdateFormData = {
    formId: number;
    title: string;
    description: string;
    img: ClientImg;
    theme: string;
    isPublic: boolean;
    tags: string[];
    users: UsersCollection;
    questions: QuestionFromClient[];
};
