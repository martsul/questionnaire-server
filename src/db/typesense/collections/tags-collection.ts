import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections.js";

export const tagsCollection: CollectionCreateSchema = {
    name: "tags",
    fields: [
        { name: "id", type: "int32" },
        { name: "tag", type: "string" },
    ],
};
