import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections.js";

export const tagsCollection: CollectionCreateSchema = {
    name: "tags",
    fields: [
        { name: "id", type: "string" },
        { name: "tag", type: "string" },
    ],
};
