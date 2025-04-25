import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections.js";

export const formsCollection: CollectionCreateSchema = {
    name: "forms",
    fields: [
        { name: "id", type: "string" },
        { name: "title", type: "string" },
        { name: "description", type: "string" },
        { name: "theme", type: "string" },
        { name: "tags", type: "string[]" },
        { name: "questionTitles", type: "string[]" },
        { name: "questionDescriptions", type: "string[]" },
        { name: "questionAnswers", type: "string[]" },
        { name: "comments", type: "string[]" },
    ],
};
